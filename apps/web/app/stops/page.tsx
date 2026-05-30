"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StopsPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  useEffect(() => { api.get("/admin/routes").then(d=>setRoutes(d.items)); }, []);

  const loadStops = async (rid: string) => {
    setSelected(rid);
    if (!rid) { setStops([]); return; }
    const s = await api.get(`/routes/${rid}/stops`);
    setStops(s);
  };

  return (
    <div>
      <div className="page-header"><h1>Stops</h1></div>
      <div className="card">
        <div className="form-group"><label>Route</label><select value={selected} onChange={e=>loadStops(e.target.value)}>
          <option value="">Select...</option>
          {routes.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
        </select></div>
        {stops.length > 0 && <div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Name</th><th>Sequence</th><th>Office</th></tr></thead>
          <tbody>{stops.map(s=><tr key={s.id}><td>{s.id}</td><td>{s.name}</td><td>{s.sequence}</td><td>{s.isOffice?'<span class="badge badge-primary">Office</span>':""}</td></tr>)}</tbody>
        </table></div>}
      </div>
    </div>
  );
}
