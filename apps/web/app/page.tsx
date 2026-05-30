"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    Promise.all([
      api.get("/admin/users").catch(()=>({items:[]})),
      api.get("/admin/vehicles").catch(()=>({items:[]})),
      api.get("/shifts"),
      api.get("/disputes?limit=1").catch(()=>({items:[]})),
      api.get("/users/me"),
    ]).then(([u, v, s, d, me]) => setStats({users:u.items.length,vehicles:v.items.length,shifts:s.items.length,disputes:d.items.length,user:me}));
  }, []);

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{stats.users ?? "-"}</div><div className="stat-label">Users</div></div>
        <div className="stat-card"><div className="stat-value">{stats.vehicles ?? "-"}</div><div className="stat-label">Vehicles</div></div>
        <div className="stat-card"><div className="stat-value">{stats.shifts ?? "-"}</div><div className="stat-label">Shifts</div></div>
        <div className="stat-card"><div className="stat-value">{stats.disputes ?? "-"}</div><div className="stat-label">Open Disputes</div></div>
      </div>
      <div className="card">
        <div className="card-header"><h3>Current User</h3></div>
        {stats.user && <div className="detail-grid">
          <dt>ID</dt><dd>{stats.user.id}</dd>
          <dt>Employee</dt><dd>{stats.user.employeeId}</dd>
          <dt>Role</dt><dd>{stats.user.role}</dd>
          <dt>Name</dt><dd>{stats.user.name ?? "-"}</dd>
        </div>}
      </div>
    </div>
  );
}
