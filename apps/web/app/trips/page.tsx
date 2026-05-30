"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/lib/badge";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  useEffect(() => {
    Promise.all([
      api.get("/admin/trips?limit=50"),
      api.get("/admin/users").catch(()=>({items:[]})),
      api.get("/admin/vehicles").catch(()=>({items:[]})),
    ]).then(([t,u,v]) => { setTrips(t.items); setDrivers(u.items.filter((x:any)=>x.role==="driver")); setVehicles(v.items); });
  }, []);

  return (
    <div>
      <div className="page-header"><h1>Trips</h1></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Type</th><th>Status</th><th>Driver</th><th>Vehicle</th><th>Source</th><th>Actions</th></tr></thead>
        <tbody>{trips.map(t=><tr key={t.id}>
          <td>{t.id}</td><td>{t.scheduledDate}</td><td><span className="badge badge-muted">{t.type}</span></td><td><StatusBadge status={t.status}/></td>
          <td>{t.driverId?`#${t.driverId}`:"-"}</td><td>{t.vehicleId?`#${t.vehicleId}`:"-"}</td><td>{t.source}</td>
          <td>
            <button className="btn btn-sm btn-outline" onClick={async()=>{const d=await api.get(`/trips/${t.id}`);setDetail(d);}}>View</button>
            {!t.driverId && <button className="btn btn-sm btn-primary" onClick={async()=>{
              const driverId = prompt("Driver ID:"); if(!driverId) return;
              await api.patch(`/admin/trips/${t.id}/allocate`,{driverId:parseInt(driverId),vehicleId:undefined});
              window.location.reload();
            }}>Allocate</button>}
          </td>
        </tr>)}</tbody>
      </table></div></div>

      {detail && <div className="card">
        <div className="card-header"><h3>Trip #{detail.id}</h3><button className="btn btn-sm btn-outline" onClick={()=>setDetail(null)}>Close</button></div>
        <div className="detail-grid" style={{marginBottom:16}}>
          <dt>Date</dt><dd>{detail.scheduledDate}</dd><dt>Type</dt><dd>{detail.type}</dd>
          <dt>Status</dt><dd><StatusBadge status={detail.status}/></dd>
        </div>
        {detail.passengers?.length > 0 && <div className="table-wrap" style={{marginBottom:12}}><table>
          <thead><tr><th>Emp</th><th>Stop</th><th>Login</th><th>Logout</th><th>Boarded</th><th>Dropped</th></tr></thead>
          <tbody>{detail.passengers.map((p:any,i:number)=><tr key={i}>
            <td>{p.employeeId}</td><td>{p.stopId??"-"}</td><td>{p.loginTime??"-"}</td><td>{p.logoutTime??"-"}</td>
            <td>{p.boardedAt?new Date(p.boardedAt).toLocaleString():"-"}</td><td>{p.droppedAt?new Date(p.droppedAt).toLocaleString():"-"}</td>
          </tr>)}</tbody>
        </table></div>}
        {detail.tripStops?.length > 0 && <div className="table-wrap"><table>
          <thead><tr><th>#</th><th>Stop</th><th>Type</th><th>Scheduled</th><th>Actual</th></tr></thead>
          <tbody>{detail.tripStops.map((s:any)=><tr key={s.id}>
            <td>{s.sequence}</td><td>{s.stopId??"-"}</td><td>{s.type}</td><td>{s.scheduledArrival??"-"}</td>
            <td>{s.actualArrival?new Date(s.actualArrival).toLocaleString():"-"}</td>
          </tr>)}</tbody>
        </table></div>}
        {detail.status==="scheduled" && <button className="btn btn-danger" style={{marginTop:12}} onClick={async()=>{await api.post(`/trips/${detail.id}/cancel`);setDetail(null);window.location.reload();}}>Cancel Trip</button>}
      </div>}
    </div>
  );
}
