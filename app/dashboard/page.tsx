"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#1A0A08"/>
      <path d="M16 4L6 8v7c0 6 4.2 11.2 10 12.8C21.8 26.2 26 21 26 15V8L16 4z" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" strokeWidth="1.3"/>
      <path d="M10 17h2.5l1.5-3 2.5 6 2-4.5 1 1.5H22" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Pin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, verticalAlign: "-1px", marginRight: 5 }}>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

type WorkerStatus = "safe" | "active" | "overdue" | "offline";

const DEMO_WORKERS = [
  { id:"w1", name:"Marcus Webb",    role:"Electrician",   site:"Plant Room B – Level 2",     status:"active"  as WorkerStatus, lastCheckIn:"8 min ago",  interval:30, checkIns:4 },
  { id:"w2", name:"Sarah Okafor",   role:"HVAC Tech",     site:"Rooftop Unit – Tower A",     status:"overdue" as WorkerStatus, lastCheckIn:"52 min ago", interval:30, checkIns:2 },
  { id:"w3", name:"Dean Mitchell",  role:"Mechanical",    site:"Basement Boiler Room",       status:"safe"    as WorkerStatus, lastCheckIn:"4 min ago",  interval:15, checkIns:11 },
  { id:"w4", name:"Priya Nambiar",  role:"Safety Tech",   site:"Substation 3B, North Site",  status:"active"  as WorkerStatus, lastCheckIn:"12 min ago", interval:60, checkIns:1 },
];

const STATUS = {
  safe:    { label:"Safe",    color:"#34D399", bg:"rgba(52,211,153,0.10)" },
  active:  { label:"Active",  color:"#59A6C4", bg:"rgba(89,166,196,0.12)" },
  overdue: { label:"Overdue", color:"#FF3B3B", bg:"rgba(255,59,59,0.10)"  },
  offline: { label:"Offline", color:"#948E9C", bg:"rgba(148,142,156,0.10)" },
};

type Session = { worker: string; site: string; interval: number; checkIns: { time: string; lat?: number; lng?: number }[]; sessionStart: string };

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ss_sessions");
      if (raw) setSessions(JSON.parse(raw));
    } catch {}
  }, []);

  const overdue = DEMO_WORKERS.filter(w => w.status === "overdue").length;
  const safe    = DEMO_WORKERS.filter(w => w.status === "safe" || w.status === "active").length;

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--void:#08030A;--surface:#0E0910;--card:#140E17;--border:rgba(255,255,255,0.08);--chalk:#F1F1F4;--stone:#948E9C;--mist:#5B5661;--signal:#FF6B35;--safe:#34D399;--alert:#FF3B3B;--cyan:#59A6C4;--gold:#E0A63C}
        body{background:var(--void);color:var(--chalk);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;height:62px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1rem,4vw,2.5rem);background:rgba(8,3,10,0.92);border-bottom:1px solid var(--border);backdrop-filter:blur(20px)}
        .card{background:var(--card);border:1px solid var(--border);border-radius:12px}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.3)}}
        .pulse{animation:pulse-dot 1.4s ease-in-out infinite}
        .worker-row{display:flex;align-items:center;gap:14px;padding:16px 20px;border-bottom:1px solid var(--border);transition:background 160ms}
        .worker-row:hover{background:rgba(255,255,255,0.015)}
        .worker-row:last-child{border-bottom:none}
      `}</style>

      <nav className="nav">
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <Logo />
          <span style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--chalk)" }}>Safe<span style={{ color:"var(--signal)" }}>Signal</span></span>
        </Link>
        <div style={{ display:"flex", gap:24, alignItems:"center" }}>
          <Link href="/dashboard" style={{ fontSize:"0.82rem", color:"var(--signal)", textDecoration:"none", fontWeight:600 }}>Dashboard</Link>
          <Link href="/checkin" style={{ fontSize:"0.82rem", color:"var(--stone)", textDecoration:"none" }}>Check In</Link>
        </div>
      </nav>

      <main style={{ paddingTop:62, minHeight:"100vh" }}>
        {/* Header */}
        <div style={{ background:"rgba(255,255,255,0.015)", borderBottom:"1px solid var(--border)", padding:"2.5rem clamp(1rem,4vw,2.5rem)" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.16em", color:"var(--signal)", marginBottom:10 }}>LONE WORKER DASHBOARD</div>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.2rem,5vw,3.2rem)", fontWeight:400, letterSpacing:"0.01em", lineHeight:0.95, marginBottom:8 }}>Worker Status</h1>
            <p style={{ fontSize:"0.875rem", color:"var(--stone)" }}>A preview of the supervisor team view. The crew below is sample data showing how live status appears — your own check-in sessions appear beneath it.</p>
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"clamp(1.5rem,3vw,2.5rem) clamp(1rem,4vw,2.5rem)" }}>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, marginBottom:28 }}>
            {[
              { label:"Active Sessions", val: DEMO_WORKERS.length.toString(), color:"var(--cyan)" },
              { label:"Overdue",         val: overdue.toString(),              color:"var(--alert)" },
              { label:"Safe & Checked",  val: safe.toString(),                 color:"var(--safe)" },
              { label:"Your Sessions",   val: sessions.length.toString(),      color:"var(--gold)" },
            ].map(({ label, val, color }) => (
              <div key={label} className="card" style={{ padding:"20px 22px" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.12em", color:"var(--mist)", marginBottom:10 }}>{label.toUpperCase()}</div>
                <div style={{ fontSize:"2rem", fontWeight:700, fontFamily:"'JetBrains Mono',monospace", color }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Worker table */}
          <div className="card" style={{ marginBottom:28, overflow:"hidden" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, fontSize:"0.95rem" }}>Active Workers</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.1em", color:"var(--signal)", background:"rgba(255,107,53,0.1)", border:"1px solid rgba(255,107,53,0.25)", padding:"3px 10px", borderRadius:100 }}>SAMPLE DATA</span>
            </div>
            {DEMO_WORKERS.map((w) => {
              const s = STATUS[w.status];
              return (
                <div key={w.id} className="worker-row">
                  {/* Avatar */}
                  <div style={{ width:40, height:40, borderRadius:"50%", background:`rgba(${w.status === "overdue" ? "255,59,59" : "255,107,53"},0.15)`, border:`1px solid ${s.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:"0.82rem", color:s.color, flexShrink:0 }}>
                    {w.name.split(" ").map(n => n[0]).join("")}
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                      <span style={{ fontWeight:600, fontSize:"0.92rem" }}>{w.name}</span>
                      <span style={{ fontSize:"0.72rem", color:"var(--mist)" }}>{w.role}</span>
                    </div>
                    <div style={{ fontSize:"0.78rem", color:"var(--stone)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"flex", alignItems:"center" }}><Pin />{w.site}</div>
                  </div>

                  {/* Last check-in */}
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:"0.78rem", color:"var(--mist)", marginBottom:4 }}>Last check-in</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.8rem", color: w.status === "overdue" ? "var(--alert)" : "var(--chalk)" }}>{w.lastCheckIn}</div>
                  </div>

                  {/* Status */}
                  <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 10px", borderRadius:100, background:s.bg, border:`1px solid ${s.color}40` }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:s.color, flexShrink:0 }} className={w.status === "overdue" ? "pulse" : ""} />
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", color:s.color }}>{s.label.toUpperCase()}</span>
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.62rem", color:"var(--mist)" }}>{w.interval} min interval · {w.checkIns} check-ins</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Your check-in history */}
          {sessions.length > 0 && (
            <div className="card" style={{ marginBottom:28, overflow:"hidden" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)" }}>
                <span style={{ fontWeight:700, fontSize:"0.95rem" }}>Your Recent Sessions</span>
              </div>
              {sessions.slice(0, 5).map((s, i) => (
                <div key={i} style={{ padding:"14px 20px", borderBottom: i < Math.min(sessions.length, 5) - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
                    <div>
                      <div style={{ fontSize:"0.88rem", fontWeight:600, marginBottom:3 }}>{s.worker}</div>
                      {s.site && <div style={{ fontSize:"0.78rem", color:"var(--stone)", display:"flex", alignItems:"center" }}><Pin />{s.site}</div>}
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.72rem", color:"var(--safe)", marginBottom:3 }}>{s.checkIns.length} check-ins</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.65rem", color:"var(--mist)" }}>{s.interval} min interval</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alert summary */}
          {overdue > 0 && (
            <div style={{ padding:"20px 24px", borderRadius:12, border:"1px solid rgba(255,59,59,0.3)", background:"rgba(255,59,59,0.06)", marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--alert)" }} className="pulse" />
                <span style={{ fontWeight:700, color:"var(--alert)", fontSize:"0.92rem" }}>Alert: {overdue} worker{overdue > 1 ? "s" : ""} overdue</span>
              </div>
              <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.5)", marginBottom:14 }}>
                Sarah Okafor — HVAC Tech — Rooftop Unit Tower A. Last check-in 52 minutes ago, past the grace period. In the full service, escalation to their emergency contact would begin here.
              </p>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ background:"var(--alert)", color:"#fff", border:"none", padding:"8px 18px", borderRadius:7, fontSize:"0.8rem", fontWeight:700, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                  Escalate Alert
                </button>
                <button style={{ background:"transparent", color:"var(--stone)", border:"1px solid var(--border)", padding:"8px 18px", borderRadius:7, fontSize:"0.8rem", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
                  Mark Resolved
                </button>
              </div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.6rem", letterSpacing:"0.08em", color:"var(--mist)", marginTop:12, textTransform:"uppercase" }}>
                Preview — controls are illustrative in this sample view
              </p>
            </div>
          )}

          {/* CTA */}
          <div style={{ textAlign:"center", padding:"2rem", border:"1px solid var(--border)", borderRadius:12, background:"rgba(255,255,255,0.01)" }}>
            <p style={{ color:"var(--stone)", fontSize:"0.875rem", marginBottom:16 }}>Ready to start a session? Your timer and GPS check-ins are one tap away.</p>
            <Link href="/checkin" style={{ background:"var(--signal)", color:"#fff", padding:"12px 28px", borderRadius:8, fontWeight:700, textDecoration:"none", fontSize:"0.9rem" }}>
              Start Check-In Session →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
