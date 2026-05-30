"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/lib/badge";

export default function AdhocPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const load = () => Promise.all([
    api.get("/admin/adhoc-trips?limit=50"),
    api.get("/admin/users").catch(()=>({items:[]})),
  ]).then(([t,u]) => { setTrips(t.items); setEmployees(u.items.filter((x:any)=>x.role==="employee")); setDrivers(u.items.filter((x:any)=>x.role==="driver")); });
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="page-header"><h1>Ad-hoc Trips</h1>
        <button className="btn btn-primary" onClick={async()=>{
          const eid = prompt("Employee ID (number):"); if(!eid) return;
          const date = prompt("Date (YYYY-MM-DD):"); if(!date) return;
          const time = prompt("Time (HH:MM):"); if(!time) return;
          await api.post("/adhoc-trips",{scheduledDate:date,scheduledTime:time,pickupLocation:{lat:0,lng:0},dropoffLocation:{lat:0,lng:0}});
          load();
        }}>+ New</button>
      </div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Employee</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{trips.map(t=><tr key={t.id}>
          <td>{t.id}</td><td>#{t.employeeId}</td><td>{t.scheduledDate}</td><td>{t.scheduledTime}</td><td><StatusBadge status={t.status}/></td>
          <td>
            {t.status==="requested" && <button className="btn btn-sm btn-primary" onClick={async()=>{
              const did = prompt("Driver ID:"); if(!did) return;
              await api.patch(`/admin/adhoc-trips/${t.id}/allocate`,{driverId:parseInt(did)}); load();
            }}>Allocate</button>}
            {t.status!=="cancelled"&&t.status!=="completed" && <button className="btn btn-sm btn-danger" onClick={async()=>{await api.post(`/adhoc-trips/${t.id}/cancel`);load();}}>Cancel</button>}
          </td>
        </tr>)}</tbody>
      </table></div></div>
    </div>
  );
}
