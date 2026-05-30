"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import "./globals.css";

const NAV = [
  { label: "Dashboard", path: "/" },
  { label: "Users", path: "/users" },
  { label: "Trips", path: "/trips" },
  { label: "Roster Bookings", path: "/rosters" },
  { label: "Ad-hoc Trips", path: "/adhoc" },
  { label: "Routes", path: "/routes" },
  { label: "Stops", path: "/stops" },
  { label: "Shifts", path: "/shifts" },
  { label: "Vehicles", path: "/vehicles" },
  { label: "Disputes", path: "/disputes" },
  { label: "Notifications", path: "/notifications" },
  { label: "Trip Generation", path: "/generate" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    setDone(true);
    if (pathname === "/login") return;
    api.get("/users/me").then(setUser).catch(() => router.push("/login"));
  }, []);

  if (pathname === "/login") return <>{children}</>;

  if (!user) return <div style={{padding:40,textAlign:"center",color:"var(--text-muted)"}}>Loading...</div>;

  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>EasyRoute</h2>
          <div className="sidebar-subtitle">Admin Panel</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => (
            <a key={n.path} href={n.path} className={pathname === n.path ? "active" : ""}
              onClick={(e) => { e.preventDefault(); router.push(n.path); }}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span style={{fontSize:11,color:"var(--text-muted)"}}>{user.employeeId} ({user.role})</span>
          <button className="btn btn-sm btn-outline" onClick={async () => {
            await api.post("/auth/logout"); setUser(null); router.push("/login");
          }}>Logout</button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
