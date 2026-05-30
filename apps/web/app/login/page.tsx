"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/login", { employeeId, password });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"var(--bg)"}}>
      <div className="card" style={{width:380}}>
        <h2 style={{marginBottom:20}}>EasyRoute Admin</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group"><label>Employee ID</label><input value={employeeId} onChange={(e)=>setEmployeeId(e.target.value)} required/></div>
          <div className="form-group"><label>Password</label><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/></div>
          {error && <p style={{color:"var(--danger)",fontSize:13,marginBottom:12}}>{error}</p>}
          <button type="submit" className="btn btn-primary" style={{width:"100%"}}>Login</button>
        </form>
      </div>
    </div>
  );
}
