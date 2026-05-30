"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [form, setForm] = useState({plateNumber:"",model:"",capacity:4,color:"",isActive:true});
  const [editId, setEditId] = useState<number|null>(null);
  const load = () => api.get("/admin/vehicles").then(d=>setVehicles(d.items));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="page-header"><h1>Vehicles</h1><button className="btn btn-primary" onClick={()=>setEditId(-1)}>+ Add</button></div>
      {(editId !== null) && <div className="card" style={{marginBottom:16}}>
        <form onSubmit={async(e)=>{e.preventDefault();
          if (editId === -1) await api.post("/admin/vehicles",form);
          else await api.put(`/admin/vehicles/${editId}`,form);
          setEditId(null); setForm({plateNumber:"",model:"",capacity:4,color:"",isActive:true}); load();
        }}>
          <div className="form-row">
            <div className="form-group"><label>Plate</label><input value={form.plateNumber} onChange={e=>setForm({...form,plateNumber:e.target.value})} required/></div>
            <div className="form-group"><label>Model</label><input value={form.model} onChange={e=>setForm({...form,model:e.target.value})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Capacity</label><input type="number" value={form.capacity} onChange={e=>setForm({...form,capacity:parseInt(e.target.value)||4})}/></div>
            <div className="form-group"><label>Color</label><input value={form.color} onChange={e=>setForm({...form,color:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}><button type="submit" className="btn btn-primary">Save</button><button type="button" className="btn btn-outline" onClick={()=>setEditId(null)}>Cancel</button></div>
        </form>
      </div>}
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Plate</th><th>Model</th><th>Capacity</th><th>Color</th><th>Active</th><th>Actions</th></tr></thead>
        <tbody>{vehicles.map(v=><tr key={v.id}>
          <td>{v.id}</td><td>{v.plateNumber}</td><td>{v.model??"-"}</td><td>{v.capacity}</td><td>{v.color??"-"}</td>
          <td>{v.isActive?'<span class="badge badge-success">Yes</span>':'<span class="badge badge-muted">No</span>'}</td>
          <td><button className="btn btn-sm btn-outline" onClick={()=>{setEditId(v.id);setForm({plateNumber:v.plateNumber,model:v.model||"",capacity:v.capacity,color:v.color||"",isActive:v.isActive});}}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={async()=>{await api.del(`/admin/vehicles/${v.id}`);load();}}>Delete</button></td>
        </tr>)}</tbody>
      </table></div></div>
    </div>
  );
}
