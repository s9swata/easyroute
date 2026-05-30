import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/trips": "http://localhost:3000",
      "/admin": "http://localhost:3000",
      "/roster-bookings": "http://localhost:3000",
      "/adhoc-trips": "http://localhost:3000",
      "/routes": "http://localhost:3000",
      "/stops": "http://localhost:3000",
      "/shifts": "http://localhost:3000",
      "/disputes": "http://localhost:3000",
      "/notifications": "http://localhost:3000",
      "/driver": "http://localhost:3000",
      "/saved-locations": "http://localhost:3000",
    },
  },
});
