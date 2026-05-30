"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/lib/badge";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number|null>(null);
  const [form, setForm] = useState({employeeId:"",password:"",role:"employee",name:"",email:"",phone:""});
  const load = () => api.get("/admin/users").then(d=>setUsers(d.items));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      const {password,...rest} = form;
      await api.patch(`/admin/users/${editId}`, rest);
    } else {
      await api.post("/auth/signup", form);
    }
    setShowForm(false); setEditId(null); setForm({employeeId:"",password:"",role:"employee",name:"",email:"",phone:""});
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>Users</h1><button className="btn btn-primary" onClick={()=>setShowForm(true)}>+ Add User</button></div>
      {showForm && <div className="card" style={{marginBottom:16}}>
        <h3 style={{marginBottom:12}}>{editId?"Edit User":"Add User"}</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group"><label>Employee ID</label><input value={form.employeeId} onChange={e=>setForm({...form,employeeId:e.target.value})} required={!editId}/></div>
            {!editId && <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required={!editId}/></div>}
          </div>
          <div className="form-row">
            <div className="form-group"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
            <div className="form-group"><label>Role</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="employee">Employee</option><option value="driver">Driver</option><option value="admin">Admin</option></select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-outline" onClick={()=>{setShowForm(false);setEditId(null);}}>Cancel</button>
          </div>
        </form>
      </div>}
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Employee</th><th>Role</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
        <tbody>{users.map(u=><tr key={u.id}>
          <td>{u.id}</td><td>{u.employeeId}</td><td><StatusBadge status={u.role}/></td><td>{u.name??"-"}</td><td>{u.email??"-"}</td><td>{u.phone??"-"}</td>
          <td><button className="btn btn-sm btn-outline" onClick={()=>{setEditId(u.id);setForm({employeeId:u.employeeId,password:"",role:u.role,name:u.name||"",email:u.email||"",phone:u.phone||""});setShowForm(true);}}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={async()=>{if(confirm("Delete?")){await api.del(`/admin/users/${u.id}`);load();}}}>Delete</button></td>
        </tr>)}</tbody>
      </table></div></div>
    </div>
  );
}
