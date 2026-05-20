Core API Build Plan — Phase 3

  Principle: Thin handlers → service layer → shared Zod contracts. Uber/Ola pattern: define the contract first, implement second, never let a handler do business logic.

  DB schema lives in apps/server/src/db/schema/. Run `npm run db:generate` after schema changes.

  ---
  Step 1 — Foundation Layer (before any feature routes)

  1a. Middleware stack (do this once, everything depends on it)
  src/lib/middlewares/
    auth-guard.ts      ← requireAuth: reads session, injects userId + role into context
    role-guard.ts      ← requireRole("admin" | "driver" | "employee"): 403 if wrong role
    request-id.ts      ← inject X-Request-ID header (UUID) for tracing
    error-handler.ts   ← global Hono onError: normalize all throws to { error, code, requestId }

  1b. Standard error codes enum (in src/lib/errors.ts)
  // Every error response: { error: string, code: ERROR_CODE, requestId: string }
  NOT_FOUND | FORBIDDEN | UNAUTHORIZED | VALIDATION_ERROR | CONFLICT | INTERNAL

  1c. Shared Zod schemas → /packages/shared/src/schemas/
  Define request/response shapes here. Both server handlers and mobile client import from same source. No duplicated types.

  ---
  Step 2 — Users (simplest, unblocks mobile auth flow)

  GET  /users/me        → { id, name, email, phone, role, employeeCode?, driverInfo? }
  PATCH /users/me       → update name, phone, push_token

  - PATCH /users/me for push_token update is critical — mobile calls this after login so FCM works
  - Guard: requireAuth only

  DB: users (id, employeeId, passwordHash, role, pushToken, createdAt, updatedAt)
      employees (id, userId FK, name, email, phone, department, employeeCode, homeAddress, dropLocation, pickupLocation)
      drivers (id, userId FK, name, phone, email, vehicleId FK, licenseNumber, available)

  ---
  Step 3 — Routes + Stops (read-only, unblocks roster creation)

  GET /routes           → paginated list { id, name, startPoint, endPoint }
  GET /routes/:id/stops → ordered stops array { id, name, location, sequence }

  - No auth needed (or employee+driver only)
  - These are lookup tables — cache headers: Cache-Control: max-age=300
  - Uber pattern: stops are immutable reference data, treat them like config

  DB: routes (id, name, description, startPoint, endPoint, isActive)
      route_stops (id, routeId FK, name, address, location, sequence, estimatedMinutesFromPrev)

  ---
  Step 4 — Rosters (recurring booking templates)

  GET    /roster-bookings   → employee's own roster bookings
  POST   /roster-bookings   → create { pickupLocationId?, dropoffLocationId?, shiftScheduleId, daysOfWeek, effectiveFrom }
  DELETE /roster-bookings/:id → soft-cancel (status = cancelled), verify ownership

  - daysOfWeek bitmask validation in Zod: z.number().int().min(0).max(127)
  - Conflict check before insert: same employee + shift + overlapping dates → 409 CONFLICT
  - Cron job reads roster_bookings and generates rosters (shared trips) + trip_passengers

  DB: roster_bookings (id, employeeId FK, pickupLocationId FK?, dropoffLocationId FK?, shiftScheduleId FK, daysOfWeek, effectiveFrom, effectiveUntil, status, rosterId FK?)
      rosters (id uuid PK, routeId FK, shiftScheduleId FK, scheduledDate, status)

  ---
  Step 5 — Trips (core transport instance, 3-status lifecycle)

  5a. List + detail (read)
  GET /trips            → employee sees own trips (via trip_passengers), driver sees assigned trips (via trips.driverId)
                          filters: status, date range, page cursor
  GET /trips/:id        → full trip detail with passengers (driver) or trip info (employee)
  - Cursor pagination not offset — Uber standard. Use createdAt + id as cursor.
  - Role-scoped queries: employee joins via trip_passengers, driver queries trips.driverId

  5b. Cancel trip
  POST /trips/:id/cancel
  - State machine check: only scheduled can be cancelled
  - Cancellation cutoff: reject if scheduled date < today (configurable)
  - Store cancelledBy + cancelReason on the record (add columns if needed)

  5c. Rate trip
  POST /trips/:id/rate  → { score: 1-5, comment? }
  - Guard: trip must be completed/ongoing, employee must have been a passenger
  - Idempotency: one rating per (trip, fromUserId) — upsert not double-insert

  DB: trips (id, routeId FK?, driverId FK?, vehicleId FK?, shiftScheduleId FK?, scheduledDate, status [scheduled|ongoing|cancelled], source ["roster"|"adhoc"], sourceId, createdAt, updatedAt)
      trip_passengers (tripId FK, employeeId FK, stopId FK?, boardedAt?, droppedAt?)

  ---
  Step 6 — Ad-hoc Trips (standalone booking, separate from core trips)

  POST /adhoc-trips     → { pickupLocation, dropoffLocation, scheduledDate, scheduledTime }
  GET  /adhoc-trips     → employee's own ad-hoc trips, filtered by status
  POST /adhoc-trips/:id/cancel → only "requested"|"allocated" can cancel

  - Ad-hoc trips have their own lifecycle: requested → allocated → completed → cancelled
  - When a driver is allocated, an adhoc_trip optionally creates/linked to a trips record (trips.source = "adhoc", trips.sourceId = adhocTrip.id)
  - OTP verification lives here: driver submits OTP → validate hash → mark boarded/dropped

  OTP security pattern:
  - Store loginOtpHash + logoutOtpHash on adhoc_trips (hashed, not plaintext)
  - Generate OTP at trip creation time (6-digit numeric)
  - GET /adhoc-trips/:id/otp → returns plaintext to the requesting employee only
  - POST /adhoc-trips/:id/verify-otp → driver submits { type: "login"|"logout", otp: string }
  - login OTP verified → sets boardedAt, status moves to ongoing/in_progress
  - logout OTP verified → sets droppedAt, status moves to completed

  DB: adhoc_trips (id, employeeId FK, tripId FK?, pickupLocation geom, dropoffLocation geom, scheduledDate, scheduledTime, status [requested|allocated|completed|cancelled], loginOtpHash?, logoutOtpHash?, createdAt, updatedAt)

  ---
  Step 7 — Driver Endpoints

  PATCH /drivers/availability    → { available: boolean } toggle online/offline
  PATCH /trips/:id/stage         → { stage: "started" | "completed" }
  POST  /drivers/location        → { lat, lng, tripId } — location ping

  - Location ping: insert into location_pings. Rate: max 1 ping/5s per driver (in-memory dedupe or Redis later)
  - /stage drives the trip status machine: scheduled → ongoing (started), ongoing → cancelled/completed
  - Validate allowed transitions

  DB: location_pings (id, driverId FK, tripId FK?, lat, lng, timestamp)

  ---
  Step 8 — Notifications

  GET   /notifications           → unread first, paginated
  PATCH /notifications/:id/read  → mark read
  PATCH /notifications/read-all  → bulk mark read (Uber pattern: users expect this)

  DB: notifications (id, userId FK, title, body, isRead, createdAt, deletedAt)

  ---
  Step 9 — Saved Locations

  GET    /saved-locations
  POST   /saved-locations    → { name, address, lat, lng, type? }
  PATCH  /saved-locations/:id
  DELETE /saved-locations/:id

  - Max 10 per employee (enforce in handler, not DB constraint)
  - type enum: home | work | other

  DB: saved_locations (id, employeeId FK?, name, address, location geom, type [home|work|other])

  ---
  Step 10 — SSE Endpoints

  GET /trips/:id/stream       → employee subscribes to trip status changes
  GET /drivers/trips/stream   → driver subscribes to new assignments

  Hono SSE pattern:
  import { streamSSE } from 'hono/streaming'
  // Heartbeat every 30s to prevent proxy timeouts
  // On trip status change: broadcast to all subscribers for that tripId
  // In-memory pub/sub for single-instance MVP; swap to Redis pub/sub at scale

  ---
  Step 11 — Admin Routes (behind requireRole("admin"))

  CRUD /admin/users          → list/create/update/delete users
  CRUD /admin/routes         → manage routes + stops
  CRUD /admin/vehicles       → fleet management
  CRUD /admin/shifts         → shift schedule presets
  GET  /admin/trips          → all trips with full filters
  PATCH /admin/trips/:id/allocate  → { driverId, vehicleId }
  GET  /admin/disputes       → open disputes
  PATCH /admin/disputes/:id/resolve → { resolution: string }
  GET  /admin/adhoc-trips    → all ad-hoc trips with filters
  PATCH /admin/adhoc-trips/:id/allocate → { driverId }

  DB: disputes (id, tripId FK, raisedByUserId FK, reason, description, status, resolutionMsg?, resolvedByUserId FK?, createdAt, updatedAt)

  ---
  File Structure to Build

  src/routes/
    auth.ts
    users.ts
    trips.ts
    rosters.ts
    routes.ts          (route lookup, not Hono routes)
    adhoc-trips.ts
    driver.ts
    notifications.ts
    saved-locations.ts
    sse.ts
    admin/
      users.ts
      routes.ts
      vehicles.ts
      shifts.ts
      trips.ts
      disputes.ts

  src/services/           ← business logic lives here, handlers just parse + delegate
    trip.service.ts
    adhoc-trip.service.ts
    roster.service.ts
    notification.service.ts

  src/lib/
    errors.ts
    middlewares/
      auth-guard.ts
      role-guard.ts
      error-handler.ts

  src/db/schema/
    enums.ts
    users.ts
    vehicles.ts
    routes.ts
    shifts.ts
    rosters.ts
    trips.ts
    adhoc.ts
    ratings.ts
    notifications.ts
    saved_locations.ts
    disputes.ts
    location_pings.ts
    sessions.ts
    password_reset_tokens.ts

  ---
  Build Order Summary

  ┌─────┬──────────────────────────────────────────────┬──────────────────────────────────────────┐
  │  #  │                     What                     │                  Reason                  │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 1   │ Middleware + error handling                  │ Everything else depends on it            │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 2   │ GET/PATCH /users/me                          │ Unblocks mobile auth completion          │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 3   │ Routes + stops (read)                        │ Needed for roster creation UI            │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 4   │ Rosters CRUD                                 │ Needed before cron can generate trips    │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 5   │ Trips (list → detail → cancel → rate)        │ Core flow                                │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 6   │ Ad-hoc trips + OTP verify                    │ Completes driver-employee trip handshake │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 7   │ Driver endpoints                             │ Availability + location + stage          │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 8   │ Notifications                                │ Background feature, unblocks FCM         │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 9   │ Saved locations                              │ Low-risk CRUD                            │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 10  │ SSE                                          │ Real-time layer on top of working REST   │
  ├─────┼──────────────────────────────────────────────┼──────────────────────────────────────────┤
  │ 11  │ Admin routes                                 │ Dashboard phase, not mobile-blocking     │

  ---
  Current Enums (defined in db/schema/enums.ts)

  user_role:           employee | driver | admin
  trip_status:         scheduled | ongoing | cancelled
  adhoc_trip_status:   requested | allocated | completed | cancelled
  roster_trip_status:  scheduled | ongoing | cancelled
  saved_location_type: home | work | other
  dispute_reason:      pickup_issue | drop_issue | trip_quality | other
  dispute_status:      open | in_review | resolved
