"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function GeneratePage() {
  const [date, setDate] = useState(new Date(Date.now()+86400000).toISOString().split("T")[0]);
  const [result, setResult] = useState<string>("");

  return (
    <div>
      <div className="page-header"><h1>Trip Generation</h1></div>
      <div className="card">
        <h3 style={{marginBottom:12}}>Generate Trips from Roster Bookings</h3>
        <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:16}}>
          Creates login+logout trip pairs for all active roster bookings on the specified date.
          Groups by shift+route, clusters by stop proximity (max 4/vehicle), estimates arrival times using speed profiles.
        </p>
        <div style={{display:"flex",gap:12,alignItems:"end",flexWrap:"wrap"}}>
          <div className="form-group" style={{margin:0}}>
            <label>Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
          </div>
          <button className="btn btn-primary" onClick={async()=>{
            setResult("Generating...");
            try {
              const r = await api.post("/admin/cron/generate-trips",{date});
              setResult(`Created: ${r.created}, Skipped: ${r.skipped}`);
            } catch(err:any) {
              setResult(`Error: ${err.message}`);
            }
          }}>Generate</button>
        </div>
        {result && <div style={{marginTop:12,padding:"8px 12px",borderRadius:"var(--radius)",background:result.startsWith("Error")?"#fee2e2":"#dcfce7",color:result.startsWith("Error")?"var(--danger)":"var(--success)"}}>{result}</div>}
      </div>
    </div>
  );
}
