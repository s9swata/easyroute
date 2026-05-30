"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [form, setForm] = useState({name:"",startTime:"",endTime:"",daysOfWeek:62});
  const [editId, setEditId] = useState<number|null>(null);
  const load = () => api.get("/shifts").then(d=>setShifts(d.items));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="page-header"><h1>Shifts</h1>
        <button className="btn btn-primary" onClick={()=>setEditId(-1)}>+ Add</button>
      </div>
      {(editId !== null) && <div className="card" style={{marginBottom:16}}>
        <form onSubmit={async(e)=>{e.preventDefault();
          if (editId === -1) await api.post("/shifts",form);
          else await api.put(`/shifts/${editId}`,form);
          setEditId(null); setForm({name:"",startTime:"",endTime:"",daysOfWeek:62}); load();
        }}>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
            <div className="form-group"><label>Days (bitmask)</label><input type="number" value={form.daysOfWeek} onChange={e=>setForm({...form,daysOfWeek:parseInt(e.target.value)||62})}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Start</label><input type="time" value={form.startTime} onChange={e=>setForm({...form,startTime:e.target.value})} required/></div>
            <div className="form-group"><label>End</label><input type="time" value={form.endTime} onChange={e=>setForm({...form,endTime:e.target.value})} required/></div>
          </div>
          <div style={{display:"flex",gap:8}}><button type="submit" className="btn btn-primary">Save</button><button type="button" className="btn btn-outline" onClick={()=>setEditId(null)}>Cancel</button></div>
        </form>
      </div>}
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Name</th><th>Start</th><th>End</th><th>Days</th><th>Actions</th></tr></thead>
        <tbody>{shifts.map(s=><tr key={s.id}>
          <td>{s.id}</td><td>{s.name}</td><td>{s.startTime}</td><td>{s.endTime}</td><td>{s.daysOfWeek??62}</td>
          <td><button className="btn btn-sm btn-outline" onClick={()=>{setEditId(s.id);setForm({name:s.name,startTime:s.startTime,endTime:s.endTime,daysOfWeek:s.daysOfWeek??62});}}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={async()=>{await api.del(`/shifts/${s.id}`);load();}}>Delete</button></td>
        </tr>)}</tbody>
      </table></div></div>
    </div>
  );
}
