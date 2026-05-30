"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const load = () => api.get("/notifications?limit=50").then(d=>setNotifs(d.items));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="page-header"><h1>Notifications</h1><button className="btn btn-sm btn-outline" onClick={async()=>{await api.patch("/notifications/read-all");load();}}>Mark All Read</button></div>
      <div className="card">
        {notifs.length === 0 ? <p style={{textAlign:"center",padding:40,color:"var(--text-muted)"}}>None</p> :
        notifs.map(n=> <div key={n.id} style={{display:"flex",justifyContent:"space-between",padding:12,borderBottom:"1px solid var(--border)",gap:12}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:n.isRead?400:600}}>{n.title}</div>
            <div style={{fontSize:12,color:"var(--text-muted)"}}>{n.body}</div>
            <div style={{fontSize:11,color:"var(--text-muted)",marginTop:4}}>{new Date(n.createdAt).toLocaleString()}</div>
          </div>
          {!n.isRead && <button className="btn btn-sm btn-outline" onClick={async()=>{await api.patch(`/notifications/${n.id}/read`);load();}}>Read</button>}
        </div>)}
      </div>
    </div>
  );
}
