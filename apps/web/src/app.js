let currentPage = "dashboard";
let user = null;

async function api(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return data;
}

function toast(msg, type = "success") {
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  document.getElementById("toast-container").appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function showModal(html) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  return overlay.querySelector(".modal");
}
window.closeModal = () => { const m = document.querySelector(".modal-overlay"); if (m) m.remove(); };

document.querySelectorAll("#nav a").forEach((a) => {
  a.addEventListener("click", async (e) => {
    e.preventDefault();
    document.querySelectorAll("#nav a").forEach((x) => x.classList.remove("active"));
    a.classList.add("active");
    currentPage = a.dataset.page;
    await renderPage(currentPage);
  });
});

document.getElementById("logout-btn").addEventListener("click", async () => {
  await api("/auth/logout", { method: "POST" });
  toast("Logged out"); user = null;
  document.getElementById("user-info").textContent = "";
  await loadUser();
});

async function renderPage(page) {
  const el = document.getElementById("page-content");
  el.innerHTML = '<div class="loading">Loading...</div>';
  try {
    switch (page) {
      case "dashboard": await renderDashboard(el); break;
      case "users": await renderUsers(el); break;
      case "trips": await renderTrips(el); break;
      case "rosters": await renderRosters(el); break;
      case "adhoc": await renderAdhoc(el); break;
      case "routes": await renderRoutes(el); break;
      case "stops": await renderStops(el); break;
      case "shifts": await renderShifts(el); break;
      case "vehicles": await renderVehicles(el); break;
      case "disputes": await renderDisputes(el); break;
      case "notifications": await renderNotifications(el); break;
      case "generate": await renderGenerate(el); break;
      default: el.innerHTML = "<h1>Not Found</h1>";
    }
  } catch (err) {
    el.innerHTML = `<div class="card"><p style="color:var(--danger)">Error: ${err.message}</p></div>`;
  }
}

async function loadUser() {
  try {
    user = await api("/users/me");
    document.getElementById("user-info").textContent = `${user.employeeId} (${user.role})`;
  } catch { user = null; document.getElementById("user-info").textContent = "Not logged in"; }
}

(async () => { await loadUser(); await renderPage("dashboard"); })();

// ─── HELPERS ───────────────────────────────────────────────────────
function h(s) { return String(s ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function statusBadge(status) {
  const m = {
    scheduled:'<span class="badge badge-primary">scheduled</span>',
    en_route:'<span class="badge badge-warning">en_route</span>',
    at_pickup:'<span class="badge badge-warning">at_pickup</span>',
    ongoing:'<span class="badge badge-primary">ongoing</span>',
    completed:'<span class="badge badge-success">completed</span>',
    cancelled:'<span class="badge badge-danger">cancelled</span>',
    requested:'<span class="badge badge-primary">requested</span>',
    allocated:'<span class="badge badge-success">allocated</span>',
    open:'<span class="badge badge-warning">open</span>',
    in_review:'<span class="badge badge-primary">in_review</span>',
    resolved:'<span class="badge badge-success">resolved</span>',
  };
  return m[status] ?? `<span class="badge badge-muted">${h(status)}</span>`;
}
window.navigateTo = async (page) => {
  const link = document.querySelector(`#nav a[data-page="${page}"]`);
  if (link) { document.querySelectorAll("#nav a").forEach(x=>x.classList.remove("active")); link.classList.add("active"); currentPage=page; await renderPage(page); }
};

// ═══════════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════════

async function renderDashboard(el) {
  const [trips, users, vehicles, shifts, disputes] = await Promise.all([
    api("/admin/trips?limit=1").catch(()=>({items:[]})),
    api("/admin/users").catch(()=>({items:[]})),
    api("/admin/vehicles").catch(()=>({items:[]})),
    api("/shifts"),
    api("/disputes?limit=1").catch(()=>({items:[]})),
  ]);
  el.innerHTML = `
    <div class="page-header"><h1>Dashboard</h1></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${users.items.length}</div><div class="stat-label">Users</div></div>
      <div class="stat-card"><div class="stat-value">${trips.items.length}</div><div class="stat-label">Trips</div></div>
      <div class="stat-card"><div class="stat-value">${vehicles.items.length}</div><div class="stat-label">Vehicles</div></div>
      <div class="stat-card"><div class="stat-value">${shifts.items.length}</div><div class="stat-label">Shifts</div></div>
      <div class="stat-card"><div class="stat-value">${disputes.items.length}</div><div class="stat-label">Open Disputes</div></div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Quick Actions</h3></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <button class="btn btn-primary" onclick="navigateTo('users')">Manage Users</button>
        <button class="btn btn-primary" onclick="navigateTo('trips')">View Trips</button>
        <button class="btn btn-primary" onclick="navigateTo('rosters')">Roster Bookings</button>
        <button class="btn btn-primary" onclick="navigateTo('adhoc')">Ad-hoc Trips</button>
        <button class="btn btn-primary" onclick="navigateTo('generate')">Generate Trips</button>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><h3>Current User</h3></div>
      <div class="detail-grid">
        <dt>ID</dt><dd>${user?.id??"-"}</dd>
        <dt>Employee</dt><dd>${h(user?.employeeId??"-")}</dd>
        <dt>Role</dt><dd>${user?.role??"-"}</dd>
        <dt>Name</dt><dd>${h(user?.name??"-")}</dd>
      </div>
    </div>`;
}

async function renderUsers(el) {
  const data = await api("/admin/users");
  el.innerHTML = `
    <div class="page-header"><h1>Users</h1><button class="btn btn-primary" onclick="showCreateUser()">+ Add User</button></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Employee</th><th>Role</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
      <tbody>${data.items.map(u=>`<tr>
        <td>${u.id}</td><td>${h(u.employeeId)}</td>
        <td><span class="badge badge-primary">${h(u.role)}</span></td>
        <td>${h(u.name??"-")}</td><td>${h(u.email??"-")}</td><td>${h(u.phone??"-")}</td>
        <td><button class="btn btn-sm btn-outline" onclick="showEditUser(${u.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">Delete</button></td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.showCreateUser = () => {
    const modal = showModal(`<h2>Create User</h2><form id="cu-form">
      <div class="form-group"><label>Employee ID</label><input name="employeeId" required></div>
      <div class="form-group"><label>Password</label><input name="password" type="password" required minlength="6"></div>
      <div class="form-group"><label>Role</label><select name="role"><option value="employee">Employee</option><option value="driver">Driver</option><option value="admin">Admin</option></select></div>
      <div class="form-group"><label>Name</label><input name="name" required></div>
      <div class="form-row"><div class="form-group"><label>Email</label><input name="email"></div><div class="form-group"><label>Phone</label><input name="phone"></div></div>
      <div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create</button></div>
    </form>`);
    modal.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault(); const fd = new FormData(e.target);
      try { await api("/auth/signup",{method:"POST",body:JSON.stringify(Object.fromEntries(fd))}); toast("User created"); closeModal(); await renderPage(currentPage); }
      catch(err) { toast(err.message,"error"); }
    });
  };
  window.showEditUser = async (id) => {
    const modal = showModal(`<h2>Edit User #${id}</h2><div class="loading"></div>`);
    try {
      const u = await api(`/admin/users/${id}`);
      modal.innerHTML = `<h2>Edit User #${id}</h2><form id="eu-form">
        <div class="form-group"><label>Name</label><input name="name" value="${h(u.name??"")}"></div>
        <div class="form-row"><div class="form-group"><label>Email</label><input name="email" value="${h(u.email??"")}"></div><div class="form-group"><label>Phone</label><input name="phone" value="${h(u.phone??"")}"></div></div>
        <div class="form-group"><label>Role</label><select name="role"><option value="employee"${u.role==="employee"?" selected":""}>Employee</option><option value="driver"${u.role==="driver"?" selected":""}>Driver</option><option value="admin"${u.role==="admin"?" selected":""}>Admin</option></select></div>
        <div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
      </form>`;
      modal.querySelector("form").addEventListener("submit", async e => {
        e.preventDefault(); const fd = new FormData(e.target);
        try { await api(`/admin/users/${id}`,{method:"PATCH",body:JSON.stringify(Object.fromEntries(fd))}); toast("User updated"); closeModal(); await renderPage(currentPage); }
        catch(err) { toast(err.message,"error"); }
      });
    } catch(err) { toast(err.message,"error"); closeModal(); }
  };
  window.deleteUser = async (id) => { if(!confirm("Delete user?")) return; try { await api(`/admin/users/${id}`,{method:"DELETE"}); toast("Deleted"); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderTrips(el) {
  const [data, vehicles, drivers] = await Promise.all([
    api("/admin/trips?limit=50"), api("/admin/vehicles").catch(()=>({items:[]})),
    api("/admin/users").catch(()=>({items:[]})),
  ]);
  const driverList = drivers.items.filter(u=>u.role==="driver");
  el.innerHTML = `
    <div class="page-header"><h1>Trips</h1></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Date</th><th>Type</th><th>Status</th><th>Driver</th><th>Vehicle</th><th>Source</th><th>Actions</th></tr></thead>
      <tbody>${data.items.map(t=>`<tr>
        <td>${t.id}</td><td>${h(t.scheduledDate)}</td>
        <td><span class="badge badge-muted">${h(t.type)}</span></td>
        <td>${statusBadge(t.status)}</td>
        <td>${t.driverId?`#${t.driverId}`:"-"}</td>
        <td>${t.vehicleId?`#${t.vehicleId}`:"-"}</td>
        <td>${h(t.source)}</td>
        <td><button class="btn btn-sm btn-outline" onclick="showTripDetail(${t.id})">View</button>
        ${!t.driverId?`<button class="btn btn-sm btn-primary" onclick="showAllocate(${t.id})">Allocate</button>`:""}</td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.showTripDetail = async (id) => {
    const modal = showModal(`<h2>Trip #${id}</h2><div class="loading"></div>`);
    try {
      const t = await api(`/trips/${id}`);
      modal.innerHTML = `<h2>Trip #${id}</h2>
        <div class="detail-grid" style="margin-bottom:16px">
          <dt>Date</dt><dd>${h(t.scheduledDate)}</dd><dt>Type</dt><dd>${h(t.type)}</dd>
          <dt>Status</dt><dd>${statusBadge(t.status)}</dd><dt>Driver</dt><dd>${t.driverId?`#${t.driverId}`:"Unassigned"}</dd>
        </div>
        ${t.passengers?.length?`<h3 style="font-size:14px;margin:8px 0">Passengers</h3><div class="table-wrap" style="margin-bottom:12px"><table>
          <thead><tr><th>Emp</th><th>Stop</th><th>Login</th><th>Logout</th><th>Boarded</th><th>Dropped</th></tr></thead>
          <tbody>${t.passengers.map(p=>`<tr><td>${p.employeeId}</td><td>${p.stopId??"-"}</td><td>${p.loginTime??"-"}</td><td>${p.logoutTime??"-"}</td><td>${p.boardedAt?new Date(p.boardedAt).toLocaleString():"-"}</td><td>${p.droppedAt?new Date(p.droppedAt).toLocaleString():"-"}</td></tr>`).join("")}</tbody>
        </table></div>`:""}
        ${t.tripStops?.length?`<h3 style="font-size:14px;margin:8px 0">Stops</h3><div class="table-wrap"><table>
          <thead><tr><th>#</th><th>Stop</th><th>Type</th><th>Scheduled</th><th>Actual</th></tr></thead>
          <tbody>${t.tripStops.map(s=>`<tr><td>${s.sequence}</td><td>${s.stopId??"-"}</td><td>${h(s.type)}</td><td>${s.scheduledArrival??"-"}</td><td>${s.actualArrival?new Date(s.actualArrival).toLocaleString():"-"}</td></tr>`).join("")}</tbody>
        </table></div>`:""}
        <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">Close</button>
        ${t.status==="scheduled"?`<button class="btn btn-danger" onclick="cancelTrip(${t.id})">Cancel</button>`:""}</div>`;
    } catch(err) { toast(err.message,"error"); closeModal(); }
  };

  window.showAllocate = (tripId) => {
    const modal = showModal(`<h2>Allocate Trip #${tripId}</h2><form id="af">
      <div class="form-group"><label>Driver</label><select name="driverId" required><option value="">Select...</option>
        ${driverList.map(d=>`<option value="${d.id}">#${d.id} - ${h(d.name||d.employeeId)}</option>`).join("")}
      </select></div>
      <div class="form-group"><label>Vehicle</label><select name="vehicleId"><option value="">Select...</option>
        ${vehicles.items.map(v=>`<option value="${v.id}">#${v.id} - ${h(v.plateNumber)}</option>`).join("")}
      </select></div>
      <div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Allocate</button></div>
    </form>`);
    modal.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault(); const fd = new FormData(e.target);
      const body = {driverId:parseInt(fd.get("driverId")), vehicleId: fd.get("vehicleId")?parseInt(fd.get("vehicleId")):undefined};
      try { await api(`/admin/trips/${tripId}/allocate`,{method:"PATCH",body:JSON.stringify(body)}); toast("Allocated"); closeModal(); await renderPage(currentPage); }
      catch(err) { toast(err.message,"error"); }
    });
  };
  window.cancelTrip = async (id) => { if(!confirm("Cancel trip?")) return; try { await api(`/trips/${id}/cancel`,{method:"POST"}); toast("Cancelled"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderRosters(el) {
  const [users, shifts] = await Promise.all([api("/admin/users"), api("/shifts")]);
  const employees = users.items.filter(u=>u.role==="employee");
  let bookings = [];
  try {
    const all = await Promise.all(employees.map(e=>api("/roster-bookings").catch(()=>({items:[]}))));
    bookings = all.flatMap((r,i)=>r.items.map(b=>({...b,employeeName:employees[i].name||employees[i].employeeId})));
  } catch {}
  el.innerHTML = `
    <div class="page-header"><h1>Roster Bookings</h1><button class="btn btn-primary" onclick="showCreateRoster()">+ New Booking</button></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Employee</th><th>Shift</th><th>Days</th><th>From</th><th>Until</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${bookings.length===0?'<tr><td colspan="8" class="empty">None</td></tr>':bookings.map(b=>`<tr>
        <td>${b.id}</td><td>${h(b.employeeName||"#"+b.employeeId)}</td><td>Shift #${b.shiftScheduleId}</td>
        <td>${b.daysOfWeek}</td><td>${h(b.effectiveFrom)}</td><td>${h(b.effectiveUntil??"Open")}</td>
        <td>${statusBadge(b.status)}</td>
        <td>${b.status!=="cancelled"?`<button class="btn btn-sm btn-danger" onclick="cancelRoster(${b.id})">Cancel</button>`:""}</td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.showCreateRoster = async () => {
    const stopRows = await api("/routes/1/stops").catch(()=>[]);
    const modal = showModal(`<h2>Create Roster Booking</h2><form id="cr-form">
      <div class="form-group"><label>Employee</label><select name="employeeId" required><option value="">Select...</option>
        ${employees.map(e=>`<option value="${e.id}">${h(e.employeeId)} - ${h(e.name||"")}</option>`).join("")}
      </select></div>
      <div class="form-group"><label>Shift</label><select name="shiftScheduleId" required><option value="">Select...</option>
        ${shifts.items.map(s=>`<option value="${s.id}">${h(s.name)} (${s.startTime}-${s.endTime})</option>`).join("")}
      </select></div>
      <div class="form-row">
        <div class="form-group"><label>Pickup Stop</label><select name="pickupStopId"><option value="">Select...</option>${stopRows.map(s=>`<option value="${s.id}">${h(s.name)}</option>`).join("")}</select></div>
        <div class="form-group"><label>Dropoff Stop</label><select name="dropoffStopId"><option value="">Select...</option>${stopRows.map(s=>`<option value="${s.id}">${h(s.name)}</option>`).join("")}</select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Days (bitmask)</label><input name="daysOfWeek" type="number" value="62" min="0" max="127"></div>
        <div class="form-group"><label>Effective From</label><input name="effectiveFrom" type="date" required></div>
      </div>
      <div class="form-group"><label>Effective Until</label><input name="effectiveUntil" type="date"></div>
      <div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create</button></div>
    </form>`);
    modal.querySelector("form").addEventListener("submit", async e => {
      e.preventDefault(); const fd = new FormData(e.target);
      const body = {shiftScheduleId:parseInt(fd.get("shiftScheduleId")),daysOfWeek:parseInt(fd.get("daysOfWeek")),effectiveFrom:fd.get("effectiveFrom"),effectiveUntil:fd.get("effectiveUntil")||undefined,pickupStopId:fd.get("pickupStopId")?parseInt(fd.get("pickupStopId")):undefined,dropoffStopId:fd.get("dropoffStopId")?parseInt(fd.get("dropoffStopId")):undefined};
      try { await api("/roster-bookings",{method:"POST",body:JSON.stringify(body)}); toast("Created"); closeModal(); await renderPage(currentPage); }
      catch(err) { toast(err.message,"error"); }
    });
  };
  window.cancelRoster = async (id) => { if(!confirm("Cancel booking?")) return; try { await api(`/roster-bookings/${id}`,{method:"DELETE"}); toast("Cancelled"); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderAdhoc(el) {
  const [data, users] = await Promise.all([api("/admin/adhoc-trips?limit=50"), api("/admin/users")]);
  const drivers = users.items.filter(u=>u.role==="driver"), employees = users.items.filter(u=>u.role==="employee");
  el.innerHTML = `
    <div class="page-header"><h1>Ad-hoc Trips</h1><button class="btn btn-primary" onclick="showCreateAdhoc()">+ New</button></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Employee</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${data.items.length===0?'<tr><td colspan="6" class="empty">None</td></tr>':data.items.map(a=>`<tr>
        <td>${a.id}</td><td>#${a.employeeId}</td><td>${h(a.scheduledDate)}</td><td>${h(a.scheduledTime)}</td>
        <td>${statusBadge(a.status)}</td>
        <td><button class="btn btn-sm btn-outline" onclick="showAdhocDetail(${a.id})">View</button>
        ${a.status==="requested"?`<button class="btn btn-sm btn-primary" onclick="allocateAdhoc(${a.id})">Allocate</button>`:""}
        ${a.status!=="cancelled"&&a.status!=="completed"?`<button class="btn btn-sm btn-danger" onclick="cancelAdhoc(${a.id})">Cancel</button>`:""}</td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.showAdhocDetail = async (id) => {
    const modal = showModal(`<h2>Ad-hoc #${id}</h2><div class="loading"></div>`);
    try { const a = await api(`/adhoc-trips/${id}`);
      modal.innerHTML = `<h2>Ad-hoc #${id}</h2><div class="detail-grid"><dt>Employee</dt><dd>#${a.employeeId}</dd><dt>Date</dt><dd>${h(a.scheduledDate)}</dd><dt>Time</dt><dd>${h(a.scheduledTime)}</dd><dt>Status</dt><dd>${statusBadge(a.status)}</dd>${a.tripId?`<dt>Trip</dt><dd>#${a.tripId}</dd>`:""}</div><div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">Close</button></div>`; }
    catch(err) { toast(err.message,"error"); closeModal(); }
  };
  window.allocateAdhoc = (id) => {
    showModal(`<h2>Allocate Ad-hoc #${id}</h2><form id="aaf"><div class="form-group"><label>Driver</label><select name="driverId" required><option value="">Select...</option>${drivers.map(d=>`<option value="${d.id}">#${d.id} - ${h(d.name||d.employeeId)}</option>`).join("")}</select></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Allocate</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => {
        e.preventDefault(); const fd = new FormData(e.target);
        try { await api(`/admin/adhoc-trips/${id}/allocate`,{method:"PATCH",body:JSON.stringify({driverId:parseInt(fd.get("driverId"))})}); toast("Allocated"); closeModal(); await renderPage(currentPage); }
        catch(err) { toast(err.message,"error"); }
      });
  };
  window.showCreateAdhoc = () => {
    showModal(`<h2>Create Ad-hoc Trip</h2><form id="caf"><div class="form-group"><label>Employee</label><select name="employeeId" required><option value="">Select...</option>${employees.map(e=>`<option value="${e.id}">${h(e.employeeId)}</option>`).join("")}</select></div><div class="form-row"><div class="form-group"><label>Date</label><input name="scheduledDate" type="date" required></div><div class="form-group"><label>Time</label><input name="scheduledTime" type="time" required></div></div><div class="form-row"><div class="form-group"><label>Pickup Lat</label><input name="pickupLat" type="number" step="any"></div><div class="form-group"><label>Pickup Lng</label><input name="pickupLng" type="number" step="any"></div></div><div class="form-row"><div class="form-group"><label>Drop Lat</label><input name="dropoffLat" type="number" step="any"></div><div class="form-group"><label>Drop Lng</label><input name="dropoffLng" type="number" step="any"></div></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => {
        e.preventDefault(); const fd = new FormData(e.target);
        try { await api("/adhoc-trips",{method:"POST",body:JSON.stringify({scheduledDate:fd.get("scheduledDate"),scheduledTime:fd.get("scheduledTime"),pickupLocation:{lat:parseFloat(fd.get("pickupLat")),lng:parseFloat(fd.get("pickupLng"))},dropoffLocation:{lat:parseFloat(fd.get("dropoffLat")),lng:parseFloat(fd.get("dropoffLng"))}})}); toast("Created"); closeModal(); await renderPage(currentPage); }
        catch(err) { toast(err.message,"error"); }
      });
  };
  window.cancelAdhoc = async (id) => { if(!confirm("Cancel?")) return; try { await api(`/adhoc-trips/${id}/cancel`,{method:"POST"}); toast("Cancelled"); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderRoutes(el) {
  const data = await api("/admin/routes");
  el.innerHTML = `
    <div class="page-header"><h1>Routes</h1><button class="btn btn-primary" onclick="showCreateRoute()">+ Add Route</button></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Name</th><th>Active</th><th>Stops</th><th>Actions</th></tr></thead>
      <tbody>${data.items.map(r=>`<tr>
        <td>${r.id}</td><td>${h(r.name)}</td>
        <td>${r.isActive?'<span class="badge badge-success">Yes</span>':'<span class="badge badge-muted">No</span>'}</td>
        <td><button class="btn btn-sm btn-outline" onclick="viewRouteStops(${r.id})">View</button></td>
        <td><button class="btn btn-sm btn-outline" onclick="editRoute(${r.id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteRoute(${r.id})">Delete</button></td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.viewRouteStops = async (id) => {
    const modal = showModal(`<h2>Route #${id} Stops</h2><div class="loading"></div>`);
    try { const stops = await api(`/routes/${id}/stops`);
      modal.innerHTML = `<h2>Route #${id} Stops</h2><div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Sequence</th><th>Office</th></tr></thead><tbody>${stops.map(s=>`<tr><td>${s.id}</td><td>${h(s.name)}</td><td>${s.sequence}</td><td>${s.isOffice?'<span class="badge badge-primary">Office</span>':''}</td></tr>`).join("")}</tbody></table></div><div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">Close</button></div>`; }
    catch(err) { toast(err.message,"error"); closeModal(); }
  };
  window.showCreateRoute = () => {
    showModal(`<h2>Create Route</h2><form id="croute"><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-row"><div class="form-group"><label>Start Lat</label><input name="startLat" type="number" step="any"></div><div class="form-group"><label>Start Lng</label><input name="startLng" type="number" step="any"></div></div><div class="form-row"><div class="form-group"><label>End Lat</label><input name="endLat" type="number" step="any"></div><div class="form-group"><label>End Lng</label><input name="endLng" type="number" step="any"></div></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => { e.preventDefault(); const fd = new FormData(e.target); try { await api("/admin/routes",{method:"POST",body:JSON.stringify(Object.fromEntries(fd))}); toast("Created"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } });
  };
  window.editRoute = async (id) => {
    const modal = showModal(`<h2>Edit Route</h2><div class="loading"></div>`);
    try { const d = await api("/admin/routes"); const r = d.items.find(x=>x.id===id);
      modal.innerHTML = `<h2>Edit Route #${id}</h2><form id="eroute"><div class="form-group"><label>Name</label><input name="name" value="${h(r.name)}"></div><div class="form-row"><div class="form-group"><label>Start Lat</label><input name="startLat" value="${r.startPoint?.x??""}" step="any"></div><div class="form-group"><label>Start Lng</label><input name="startLng" value="${r.startPoint?.y??""}" step="any"></div></div><div class="form-row"><div class="form-group"><label>End Lat</label><input name="endLat" value="${r.endPoint?.x??""}" step="any"></div><div class="form-group"><label>End Lng</label><input name="endLng" value="${r.endPoint?.y??""}" step="any"></div></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div></form>`;
      modal.querySelector("form").addEventListener("submit", async e => { e.preventDefault(); const fd = new FormData(e.target); try { await api(`/admin/routes/${id}`,{method:"PUT",body:JSON.stringify(Object.fromEntries(fd))}); toast("Updated"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } });
    } catch(err) { toast(err.message,"error"); closeModal(); }
  };
  window.deleteRoute = async (id) => { if(!confirm("Delete?")) return; try { await api(`/admin/routes/${id}`,{method:"DELETE"}); toast("Deleted"); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderStops(el) {
  const routes = await api("/admin/routes");
  el.innerHTML = `
    <div class="page-header"><h1>Stops</h1></div>
    <div class="card">
      <div class="form-group"><label>Route</label><select id="sr" onchange="loadStops()"><option value="">Choose...</option>${routes.items.map(r=>`<option value="${r.id}">${h(r.name)}</option>`).join("")}</select></div>
      <div id="stops-list"><p class="empty">Select a route</p></div>
    </div>`;
  window.loadStops = async () => {
    const rid = document.getElementById("sr").value;
    const el2 = document.getElementById("stops-list");
    if(!rid) { el2.innerHTML='<p class="empty">Select a route</p>'; return; }
    try { const stops = await api(`/routes/${rid}/stops`);
      el2.innerHTML =`<div class="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Sequence</th><th>Office</th></tr></thead><tbody>${stops.map(s=>`<tr><td>${s.id}</td><td>${h(s.name)}</td><td>${s.sequence}</td><td>${s.isOffice?'<span class="badge badge-primary">Office</span>':''}</td></tr>`).join("")}</tbody></table></div>`; }
    catch(err) { el2.innerHTML=`<p style="color:var(--danger)">${err.message}</p>`; }
  };
}

async function renderShifts(el) {
  const data = await api("/shifts");
  el.innerHTML = `
    <div class="page-header"><h1>Shifts</h1><button class="btn btn-primary" onclick="showCreateShift()">+ Add Shift</button></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Name</th><th>Start</th><th>End</th><th>Days</th><th>Actions</th></tr></thead>
      <tbody>${data.items.map(s=>`<tr>
        <td>${s.id}</td><td>${h(s.name)}</td><td>${h(s.startTime)}</td><td>${h(s.endTime)}</td><td>${s.daysOfWeek??62}</td>
        <td><button class="btn btn-sm btn-outline" onclick="editShift(${s.id})">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteShift(${s.id})">Delete</button></td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.showCreateShift = () => {
    showModal(`<h2>Create Shift</h2><form id="cs"><div class="form-group"><label>Name</label><input name="name" required></div><div class="form-row"><div class="form-group"><label>Start</label><input name="startTime" type="time" required></div><div class="form-group"><label>End</label><input name="endTime" type="time" required></div></div><div class="form-group"><label>Days (bitmask)</label><input name="daysOfWeek" type="number" value="62" min="0" max="127"></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => { e.preventDefault(); const fd = new FormData(e.target); try { await api("/shifts",{method:"POST",body:JSON.stringify({name:fd.get("name"),startTime:fd.get("startTime"),endTime:fd.get("endTime"),daysOfWeek:parseInt(fd.get("daysOfWeek"))||undefined})}); toast("Created"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } });
  };
  window.editShift = async (id) => {
    const d = await api("/shifts"); const s = d.items.find(x=>x.id===id); if(!s) return;
    showModal(`<h2>Edit Shift #${id}</h2><form id="es"><div class="form-group"><label>Name</label><input name="name" value="${h(s.name)}"></div><div class="form-row"><div class="form-group"><label>Start</label><input name="startTime" type="time" value="${s.startTime}"></div><div class="form-group"><label>End</label><input name="endTime" type="time" value="${s.endTime}"></div></div><div class="form-group"><label>Days</label><input name="daysOfWeek" type="number" value="${s.daysOfWeek??62}"></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => { e.preventDefault(); const fd = new FormData(e.target); try { await api(`/shifts/${id}`,{method:"PUT",body:JSON.stringify({name:fd.get("name"),startTime:fd.get("startTime"),endTime:fd.get("endTime"),daysOfWeek:parseInt(fd.get("daysOfWeek"))||undefined})}); toast("Updated"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } });
  };
  window.deleteShift = async (id) => { if(!confirm("Delete?")) return; try { await api(`/shifts/${id}`,{method:"DELETE"}); toast("Deleted"); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderVehicles(el) {
  const data = await api("/admin/vehicles");
  el.innerHTML = `
    <div class="page-header"><h1>Vehicles</h1><button class="btn btn-primary" onclick="showCreateVehicle()">+ Add Vehicle</button></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Plate</th><th>Model</th><th>Capacity</th><th>Color</th><th>Active</th><th>Actions</th></tr></thead>
      <tbody>${data.items.map(v=>`<tr>
        <td>${v.id}</td><td>${h(v.plateNumber)}</td><td>${h(v.model??"-")}</td><td>${v.capacity}</td><td>${h(v.color??"-")}</td>
        <td>${v.isActive?'<span class="badge badge-success">Yes</span>':'<span class="badge badge-muted">No</span>'}</td>
        <td><button class="btn btn-sm btn-outline" onclick="editVehicle(${v.id})">Edit</button><button class="btn btn-sm btn-danger" onclick="deleteVehicle(${v.id})">Delete</button></td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.showCreateVehicle = () => {
    showModal(`<h2>Create Vehicle</h2><form id="cv"><div class="form-group"><label>Plate</label><input name="plateNumber" required></div><div class="form-group"><label>Model</label><input name="model"></div><div class="form-row"><div class="form-group"><label>Capacity</label><input name="capacity" type="number" min="1" required></div><div class="form-group"><label>Color</label><input name="color"></div></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Create</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => { e.preventDefault(); const fd = new FormData(e.target); try { await api("/admin/vehicles",{method:"POST",body:JSON.stringify({plateNumber:fd.get("plateNumber"),model:fd.get("model")||undefined,capacity:parseInt(fd.get("capacity")),color:fd.get("color")||undefined})}); toast("Created"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } });
  };
  window.editVehicle = async (id) => {
    const d = await api("/admin/vehicles"); const v = d.items.find(x=>x.id===id); if(!v) return;
    showModal(`<h2>Edit Vehicle #${id}</h2><form id="ev"><div class="form-group"><label>Plate</label><input name="plateNumber" value="${h(v.plateNumber)}"></div><div class="form-group"><label>Model</label><input name="model" value="${h(v.model??"")}"></div><div class="form-row"><div class="form-group"><label>Capacity</label><input name="capacity" type="number" value="${v.capacity}"></div><div class="form-group"><label>Color</label><input name="color" value="${h(v.color??"")}"></div></div><div class="form-group"><label>Active</label><select name="isActive"><option value="true"${v.isActive?" selected":""}>Yes</option><option value="false"${!v.isActive?" selected":""}>No</option></select></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => { e.preventDefault(); const fd = new FormData(e.target); try { await api(`/admin/vehicles/${id}`,{method:"PUT",body:JSON.stringify({plateNumber:fd.get("plateNumber"),model:fd.get("model")||undefined,capacity:parseInt(fd.get("capacity")),color:fd.get("color")||undefined,isActive:fd.get("isActive")==="true"})}); toast("Updated"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } });
  };
  window.deleteVehicle = async (id) => { if(!confirm("Delete?")) return; try { await api(`/admin/vehicles/${id}`,{method:"DELETE"}); toast("Deleted"); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderDisputes(el) {
  const data = await api("/disputes?limit=50");
  el.innerHTML = `
    <div class="page-header"><h1>Disputes</h1></div>
    <div class="card"><div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Trip</th><th>Raised By</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>${data.items.length===0?'<tr><td colspan="6" class="empty">None</td></tr>':data.items.map(d=>`<tr>
        <td>${d.id}</td><td>#${d.tripId}</td><td>#${d.raisedByUserId}</td><td>${h(d.reason)}</td><td>${statusBadge(d.status)}</td>
        <td>${d.status!=="resolved"?`<button class="btn btn-sm btn-primary" onclick="resolveDispute(${d.id})">Resolve</button>`:""}</td>
      </tr>`).join("")}</tbody>
    </table></div></div>`;

  window.resolveDispute = (id) => {
    showModal(`<h2>Resolve Dispute #${id}</h2><form id="rd"><div class="form-group"><label>Resolution</label><textarea name="resolution" required style="min-height:80px"></textarea></div><div class="modal-footer"><button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button><button type="submit" class="btn btn-success">Resolve</button></div></form>`)
      .querySelector("form").addEventListener("submit", async e => { e.preventDefault(); const fd = new FormData(e.target); try { await api(`/disputes/${id}/resolve`,{method:"POST",body:JSON.stringify({resolution:fd.get("resolution")})}); toast("Resolved"); closeModal(); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } });
  };
}

async function renderNotifications(el) {
  const data = await api("/notifications?limit=50");
  el.innerHTML = `
    <div class="page-header"><h1>Notifications</h1><button class="btn btn-sm btn-outline" onclick="markAllRead()">Mark All Read</button></div>
    <div class="card">${data.items.length===0?'<p class="empty">None</p>':data.items.map(n=>`<div style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid var(--border);gap:12px"><div style="flex:1"><div style="font-weight:${n.isRead?"400":"600"}">${h(n.title)}</div><div style="font-size:12px;color:var(--text-muted)">${h(n.body)}</div><div style="font-size:11px;color:var(--text-muted)">${new Date(n.createdAt).toLocaleString()}</div></div>${!n.isRead?`<button class="btn btn-sm btn-outline" onclick="markRead(${n.id})">Read</button>`:""}</div>`).join("")}</div>`;
  window.markRead = async (id) => { try { await api(`/notifications/${id}/read`,{method:"PATCH"}); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
  window.markAllRead = async () => { try { await api("/notifications/read-all",{method:"PATCH"}); toast("All read"); await renderPage(currentPage); } catch(err) { toast(err.message,"error"); } };
}

async function renderGenerate(el) {
  const tomorrow = new Date(Date.now()+86400000).toISOString().split("T")[0];
  el.innerHTML = `
    <div class="page-header"><h1>Trip Generation</h1></div>
    <div class="card">
      <h3 style="margin-bottom:12px">Generate Trips from Roster Bookings</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Creates login+logout trip pairs for all active roster bookings. Groups by shift+route, clusters by proximity (max 4/vehicle).</p>
      <form id="gf" style="display:flex;gap:12px;align-items:end;flex-wrap:wrap">
        <div class="form-group" style="margin:0"><label>Date</label><input name="date" type="date" value="${tomorrow}"></div>
        <button type="submit" class="btn btn-primary">Generate</button>
      </form>
      <div id="generate-result" style="margin-top:12px"></div>
    </div>`;
  document.getElementById("gf").addEventListener("submit", async e => {
    e.preventDefault(); const fd = new FormData(e.target);
    const r = document.getElementById("generate-result"); r.innerHTML = '<div class="loading">Generating...</div>';
    try { const res = await api("/admin/cron/generate-trips",{method:"POST",body:JSON.stringify({date:fd.get("date")})}); r.innerHTML = `<div class="toast toast-success" style="margin:0">Created: ${res.created}, Skipped: ${res.skipped}</div>`; }
    catch(err) { r.innerHTML = `<div class="toast toast-error" style="margin:0">${err.message}</div>`; }
  });
}
