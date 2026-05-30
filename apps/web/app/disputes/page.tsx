"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatusBadge } from "@/lib/badge";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  useEffect(() => { api.get("/disputes?limit=50").then(d=>setDisputes(d.items)); }, []);

  return (
    <div>
      <div className="page-header"><h1>Disputes</h1></div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>ID</th><th>Trip</th><th>Raised By</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{disputes.map(d=><tr key={d.id}>
          <td>{d.id}</td><td>#{d.tripId}</td><td>#{d.raisedByUserId}</td><td>{d.reason}</td><td><StatusBadge status={d.status}/></td>
          <td>{d.status!=="resolved" && <button className="btn btn-sm btn-primary" onClick={async()=>{
            const res = prompt("Resolution:"); if(!res) return;
            await api.post(`/disputes/${d.id}/resolve`,{resolution:res}); window.location.reload();
          }}>Resolve</button>}</td>
        </tr>)}</tbody>
      </table></div></div>
    </div>
  );
}
