"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [stops, setStops] = useState<any>({});
  useEffect(() => { api.get("/admin/routes").then(d=>setRoutes(d.items)); }, []);

  const viewStops = async (id: number) => {
    const s = await api.get(`/routes/${id}/stops`);
    setStops({...stops, [id]: s });
  };

  return (
    <div>
      <div className="page-header"><h1>Routes</h1>
        <button className="btn btn-primary" onClick={async()=>{
          const name = prompt("Name:"); if(!name) return;
          await api.post("/admin/routes",{name,startLat:0,startLng:0,endLat:0,endLng:0});
          api.get("/admin/routes").then(d=>setRoutes(d.items));
        }}>+ Add</button>
      </div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Name</th><th>Active</th><th>Stops</th><th>Actions</th></tr></thead>
        <tbody>{routes.map(r=><tr key={r.id}>
          <td>{r.id}</td><td>{r.name}</td><td>{r.isActive?'<span class="badge badge-success">Yes</span>':'<span class="badge badge-muted">No</span>'}</td>
          <td><button className="btn btn-sm btn-outline" onClick={()=>viewStops(r.id)}>{stops[r.id]?`${stops[r.id].length} stops`:"View"}</button></td>
          <td>
            <button className="btn btn-sm btn-danger" onClick={async()=>{await api.del(`/admin/routes/${r.id}`);api.get("/admin/routes").then(d=>setRoutes(d.items));}}>Delete</button>
          </td>
        </tr>)}</tbody>
      </table></div></div>
      {Object.entries(stops).map(([rid, s]:[string,any])=>s && <div key={rid} className="card">
        <div className="card-header"><h3>Route #{rid} Stops</h3><button className="btn btn-sm btn-outline" onClick={()=>setStops({...stops,[rid]:null})}>Close</button></div>
        <div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Sequence</th><th>Office</th></tr></thead>
        <tbody>{s.map((st:any)=><tr key={st.id}><td>{st.id}</td><td>{st.name}</td><td>{st.sequence}</td><td>{st.isOffice?'<span class="badge badge-primary">Office</span>':""}</td></tr>)}</tbody></table></div>
      </div>)}
    </div>
  );
}
