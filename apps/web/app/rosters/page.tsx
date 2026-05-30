"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/lib/badge";

export default function RostersPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [stops, setStops] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    Promise.all([
      api.get("/admin/users"),
      api.get("/shifts"),
      api.get("/routes/1/stops").catch(()=>[]),
    ]).then(([u,s,st]) => {
      const emps = u.items.filter((x:any)=>x.role==="employee");
      setEmployees(emps); setShifts(s.items); setStops(st);
      Promise.all(emps.map((e:any)=>api.get("/roster-bookings").catch(()=>({items:[]}))))
        .then((all:any) => setBookings(all.flatMap((r:any,i:number)=>r.items.map((b:any)=>({...b,employeeName:emps[i].name||emps[i].employeeId})))));
    });
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="page-header"><h1>Roster Bookings</h1><button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ New</button></div>
      {showForm && <div className="card" style={{marginBottom:16}}>
        <form onSubmit={async(e)=>{e.preventDefault();const fd=new FormData(e.target as HTMLFormElement);
          await api.post("/roster-bookings",{shiftScheduleId:parseInt(fd.get("shiftScheduleId") as string),daysOfWeek:parseInt(fd.get("daysOfWeek") as string),effectiveFrom:fd.get("effectiveFrom"),pickupStopId:fd.get("pickupStopId")?parseInt(fd.get("pickupStopId") as string):undefined,dropoffStopId:fd.get("dropoffStopId")?parseInt(fd.get("dropoffStopId") as string):undefined});
          setShowForm(false); load();
        }}>
          <div className="form-group"><label>Employee</label><select name="employeeId" required>{employees.map(e=><option key={e.id} value={e.id}>{e.employeeId}</option>)}</select></div>
          <div className="form-row">
            <div className="form-group"><label>Shift</label><select name="shiftScheduleId" required>{shifts.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div className="form-group"><label>Days (bitmask)</label><input name="daysOfWeek" type="number" defaultValue={62}/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>From</label><input name="effectiveFrom" type="date" required/></div>
            <div className="form-group"><label>Until</label><input name="effectiveUntil" type="date"/></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Pickup Stop</label><select name="pickupStopId"><option value="">-</option>{stops.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div className="form-group"><label>Dropoff Stop</label><select name="dropoffStopId"><option value="">-</option>{stops.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          </div>
          <div style={{display:"flex",gap:8}}><button type="submit" className="btn btn-primary">Create</button><button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button></div>
        </form>
      </div>}
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Employee</th><th>Shift</th><th>Days</th><th>From</th><th>Until</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{bookings.map(b=><tr key={b.id}>
          <td>{b.id}</td><td>{b.employeeName||"#"+b.employeeId}</td><td>#{b.shiftScheduleId}</td><td>{b.daysOfWeek}</td>
          <td>{b.effectiveFrom}</td><td>{b.effectiveUntil??"Open"}</td><td><StatusBadge status={b.status}/></td>
          <td>{b.status!=="cancelled" && <button className="btn btn-sm btn-danger" onClick={async()=>{await api.del(`/roster-bookings/${b.id}`);load();}}>Cancel</button>}</td>
        </tr>)}</tbody>
      </table></div></div>
    </div>
  );
}
