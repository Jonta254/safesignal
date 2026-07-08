"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: "⏱",
    title: "Dead-man check-ins",
    desc: "Set your interval — 15, 30, or 60 minutes. Miss a check-in and the alert chain starts automatically. No manual input needed once you're on site.",
    color: "var(--signal)",
  },
  {
    icon: "📍",
    title: "GPS on every check-in",
    desc: "Each check-in logs your exact location. If something goes wrong, your emergency contacts know where to send help — not just that something is wrong.",
    color: "var(--cyan)",
  },
  {
    icon: "🔔",
    title: "Escalating alert chain",
    desc: "Missed check-in → grace period → SMS to emergency contact → phone call → second contact. Each step waits for a response before escalating.",
    color: "var(--alert)",
  },
  {
    icon: "📊",
    title: "Manager dashboard",
    desc: "See every worker's status in real time. Green means checked in. Amber means late. Red means the alert chain is running. One view, no guessing.",
    color: "var(--safe)",
  },
  {
    icon: "📄",
    title: "Compliance reports",
    desc: "Generate lone worker compliance reports for UK HSE, Australia SafeWork, and Canadian OHS standards. PDF export, ready for audits.",
    color: "var(--gold)",
  },
  {
    icon: "📵",
    title: "Works offline",
    desc: "No signal? The timer keeps running and alerts queue to send the moment a connection returns. A basement is not an excuse for no safety system.",
    color: "var(--safe)",
  },
];

const INDUSTRIES = [
  { icon:"⚡", name:"Electrical", detail:"Panel work, live circuits, confined plant rooms — exactly where no one should be alone and without a check-in timer.", color:"var(--gold)" },
  { icon:"🔩", name:"Mechanical & HVAC", detail:"Rooftop plant, confined boiler rooms, pressurised systems. One failure with no one watching is one too many.", color:"var(--signal)" },
  { icon:"🏗️", name:"Construction", detail:"Working at height, below grade, in partially built structures. Site safety ends where mobile signal does — unless you have a system.", color:"var(--cyan)" },
  { icon:"🛢️", name:"Oil & Gas", detail:"Remote pipeline patrols, substation checks, tank farms. Mandatory lone worker protection under most jurisdiction OHS codes.", color:"var(--safe)" },
  { icon:"🚿", name:"Utilities", detail:"Water treatment, substations, remote pump stations visited solo. UK HSE Lone Worker guidance applies by law.", color:"var(--stone)" },
  { icon:"🔒", name:"Security & Facilities", detail:"Night patrols, single-guard buildings, remote site checks. Your guard shouldn't have to rely on a walkie-talkie from 1994.", color:"var(--alert)" },
];

const TESTIMONIALS = [
  { text:"I worked live panels for 14 years without anything like this. You tell yourself the risk is manageable until it isn't. SafeSignal fixes the thing nobody wants to admit is broken.", name:"Derek Walsh", role:"Electrical contractor, 3-person crew", init:"DW", color:"var(--gold)" },
  { text:"We had a near-miss on a rooftop HVAC job last summer. Nobody knew where the tech was. That's when I started looking for something like this — proper check-ins with GPS, not just a text to the office.", name:"Marcus Riley", role:"HVAC service manager", init:"MR", color:"var(--signal)" },
  { text:"Our H&S consultant told us we needed a lone worker system or we'd fail the next site audit. We found SafeSignal before we found the others. The compliance export alone is worth it.", name:"Sandra Obote", role:"Construction site safety coordinator", init:"SO", color:"var(--safe)" },
];

const HOW = [
  { n: "01", title: "Worker starts a session", body: "Open the app, choose a check-in interval, and tap Start. The timer begins." },
  { n: "02", title: "App checks in automatically", body: "Every interval, SafeSignal logs your location and marks you safe. You do nothing." },
  { n: "03", title: "Miss a check-in — alerts fire", body: "Grace period first. Then SMS. Then a call. Then the next contact. Until someone responds." },
];

const PRICING = [
  {
    name: "Solo",
    price: "$8",
    per: "worker / month",
    desc: "For independent trade workers who need personal protection.",
    features: ["Check-in timer (15/30/60 min)", "GPS on every check-in", "2 emergency contacts", "Missed check-in alerts (SMS + call)", "7-day location history"],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Team",
    price: "$14",
    per: "worker / month",
    desc: "For companies with field workers. Manager dashboard included.",
    features: ["Everything in Solo", "Manager dashboard (real-time)", "Unlimited emergency contacts", "Custom alert escalation rules", "Compliance report export (PDF)", "Admin controls + team management"],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Talk to us",
    per: "",
    desc: "For large contractors and staffing companies with 50+ workers.",
    features: ["Everything in Team", "SSO + custom integrations", "API access", "Dedicated account manager", "SLA + uptime guarantee", "Custom compliance reporting"],
    cta: "Contact sales",
    featured: false,
  },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-up, .reveal-scale");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Home() {
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollBarRef.current) scrollBarRef.current.style.transform = `scaleX(${Math.min(window.scrollY / total, 1)})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div ref={scrollBarRef} className="scroll-bar" />
      <a href="/checkin" className="float-cta" aria-label="Start a check-in session">
        <span className="float-dot" />
        Start Check-In
      </a>

      {/* ── Nav ────────────────────────────────────────────── */}
      <nav className="nav">
        <a href="/" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#1A0A08"/>
            <path d="M16 4L6 8v7c0 6 4.2 11.2 10 12.8C21.8 26.2 26 21 26 15V8L16 4z" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" strokeWidth="1.3"/>
            <path d="M10 17h2.5l1.5-3 2.5 6 2-4.5 1 1.5H22" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="nav-logo">Safe<span style={{color:"var(--signal)"}}>Signal</span></span>
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/checkin" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.8rem" }}>Start Check-In</a>
        </div>
        <button className={`hamburger${menuOpen?" open":""}`} onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mobile-nav${menuOpen?" open":""}`}>
        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
        <a href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a>
        <a href="/checkin" className="btn-primary-mobile" onClick={() => setMenuOpen(false)}>Start Check-In →</a>
      </div>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section style={{
        minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "flex-end",
        position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255,107,53,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 20%, rgba(255,59,59,0.07) 0%, transparent 55%), #08030A",
        padding: "0 clamp(1.25rem,4vw,2.5rem) clamp(3rem,6vw,5rem)",
      }}>
        {/* Grid */}
        <div aria-hidden style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,0.035) 1px,transparent 1px)",backgroundSize:"40px 40px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 80%)",opacity:0.5 }} />
        {/* Bottom fade */}
        <div aria-hidden style={{ position:"absolute",bottom:0,left:0,right:0,height:"35%",background:"linear-gradient(to top,#08030A 0%,transparent 100%)" }} />

        {/* Available badge */}
        <div style={{ position:"absolute",top:"clamp(5rem,9vw,7rem)",left:"clamp(1.25rem,4vw,2.5rem)",display:"flex",alignItems:"center",gap:8,background:"rgba(255,107,53,0.07)",border:"1px solid rgba(255,107,53,0.22)",borderRadius:100,padding:"5px 14px 5px 8px",backdropFilter:"blur(12px)" }}>
          <div className="dot dot-safe" />
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1.1vw,10px)",letterSpacing:"0.18em",color:"var(--safe)",textTransform:"uppercase",whiteSpace:"nowrap" }}>
            In development
          </span>
        </div>

        <div style={{ maxWidth:1200,margin:"0 auto",width:"100%",position:"relative",zIndex:2 }}>
          <div className="reveal" style={{ marginBottom:"clamp(0.75rem,2vw,1.25rem)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(9px,1.1vw,11px)",letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase" }}>
              // Lone Worker Safety
            </span>
          </div>

          <h1 className="reveal" style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3.5rem,13vw,10rem)",lineHeight:0.88,letterSpacing:"0.01em",marginBottom:"clamp(1.25rem,3vw,2rem)",maxWidth:"900px" }}>
            <span style={{ color:"var(--chalk)" }}>No one works</span>
            <br />
            <span style={{ background:"linear-gradient(90deg, var(--signal), var(--alert))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
              alone without
            </span>
            <br />
            <span style={{ color:"var(--chalk)" }}>a safety net.</span>
          </h1>

          <p className="reveal" style={{ fontSize:"clamp(1rem,1.8vw,1.2rem)",lineHeight:1.75,color:"rgba(255,255,255,0.55)",maxWidth:520,marginBottom:"clamp(1.5rem,4vw,2.5rem)" }}>
            Automatic check-ins, escalating alerts, and real-time GPS for trade workers on the job alone. Because no one should work inside a live panel with nobody knowing where they are.
          </p>

          <div className="reveal" style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            <a href="/checkin" className="btn btn-primary">Start Check-In Now →</a>
            <a href="/dashboard" className="btn btn-ghost">View Dashboard</a>
          </div>

          {/* Social proof */}
          <div className="reveal" style={{ marginTop:"clamp(2rem,5vw,3.5rem)",display:"flex",alignItems:"center",gap:"clamp(1rem,3vw,2rem)",flexWrap:"wrap" }}>
            {[
              { n: "6,500+", label: "Trade deaths per year (US)" },
              { n: "73%",   label: "Worked alone in the last week" },
              { n: "3",     label: "Countries with lone worker laws" },
            ].map((s) => (
              <div key={s.label} style={{ borderLeft:"1px solid rgba(255,107,53,0.18)",paddingLeft:"clamp(0.875rem,2vw,1.25rem)" }}>
                <p style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.5rem,3vw,2.25rem)",lineHeight:1,color:"var(--chalk)",marginBottom:3 }}>{s.n}</p>
                <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"clamp(8px,1vw,10px)",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.28)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="section" style={{ background:"radial-gradient(ellipse 60% 50% at 90% 50%, rgba(255,107,53,0.07) 0%, transparent 60%), #0A040D" }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom:"clamp(2.5rem,6vw,5rem)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <span style={{ display:"block",width:20,height:1,background:"var(--signal)",opacity:0.55 }} />
              Features
            </span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:0.9,letterSpacing:"0.01em",color:"var(--chalk)" }}>
              BUILT FOR THE<br />PERSON IN THE FIELD.
            </h2>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card reveal-scale" style={{ padding:"clamp(1.5rem,3vw,2rem)", animationDelay:`${i*60}ms` }}>
                <div style={{ width:44,height:44,borderRadius:12,background:`${f.color}14`,border:`1px solid ${f.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",marginBottom:16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(1rem,1.8vw,1.125rem)",letterSpacing:"0.04em",color:"var(--chalk)",marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:"0.875rem",lineHeight:1.75,color:"rgba(255,255,255,0.4)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ─────────────────────────────────────── */}
      <section className="section" style={{ background:"#08030A", paddingTop:"clamp(2rem,5vw,4rem)" }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom:"clamp(2rem,5vw,4rem)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <span style={{ display:"block",width:20,height:1,background:"var(--signal)",opacity:0.55 }} />
              Industries
            </span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:0.9,letterSpacing:"0.01em",color:"var(--chalk)" }}>
              IF YOU WORK ALONE<br />IN ANY OF THESE,
            </h2>
            <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(1rem,2vw,1.25rem)",color:"rgba(255,255,255,0.35)",marginTop:"0.75rem",fontWeight:500 }}>you need SafeSignal.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,280px),1fr))",gap:"1.25rem" }}>
            {INDUSTRIES.map((ind, i) => (
              <div key={ind.name} className="card reveal-scale" style={{ padding:"1.75rem",transitionDelay:`${i*55}ms` }}>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:"1rem" }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:`${ind.color}14`,border:`1px solid ${ind.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0 }}>{ind.icon}</div>
                  <span style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"1.05rem",letterSpacing:"0.06em",color:"var(--chalk)",textTransform:"uppercase" }}>{ind.name}</span>
                </div>
                <p style={{ fontSize:"0.8rem",lineHeight:1.75,color:"rgba(255,255,255,0.38)" }}>{ind.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="section" style={{ background:"radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,107,53,0.06) 0%, transparent 60%), #0A040D", paddingTop:"clamp(2.5rem,6vw,5rem)" }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom:"clamp(2rem,5vw,4rem)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <span style={{ display:"block",width:20,height:1,background:"var(--signal)",opacity:0.55 }} />
              From the field
            </span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:0.9,letterSpacing:"0.01em",color:"var(--chalk)" }}>
              REAL WORKERS.<br />REAL RISK.
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,320px),1fr))",gap:"1.25rem" }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card reveal-scale" style={{ padding:"2rem",transitionDelay:`${i*70}ms`,borderColor:`${t.color}22` }}>
                <div style={{ fontSize:"2.5rem",lineHeight:1,color:`${t.color}22`,fontFamily:"Georgia,serif",marginBottom:"0.75rem" }}>&ldquo;</div>
                <p style={{ fontSize:"0.9rem",lineHeight:1.8,color:"rgba(255,255,255,0.5)",fontStyle:"italic",marginBottom:"1.5rem" }}>{t.text}</p>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${t.color},${t.color}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:800,color:"#08030A",flexShrink:0 }}>{t.init}</div>
                  <div>
                    <div style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"0.875rem",letterSpacing:"0.05em",color:"var(--chalk)",textTransform:"uppercase" }}>{t.name}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"0.65rem",letterSpacing:"0.08em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how" className="section" style={{ background:"#08030A" }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom:"clamp(2.5rem,6vw,5rem)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <span style={{ display:"block",width:20,height:1,background:"var(--signal)",opacity:0.55 }} />
              How it works
            </span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:0.9,letterSpacing:"0.01em",color:"var(--chalk)" }}>
              THREE STEPS.<br />THAT&apos;S IT.
            </h2>
          </div>

          <div className="steps-grid">
            {HOW.map((h, i) => (
              <div key={h.n} className="reveal" style={{ transitionDelay:`${i*80}ms` }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3.5rem,7vw,6rem)",lineHeight:1,color:"rgba(255,107,53,0.10)",marginBottom:12 }}>{h.n}</div>
                <div style={{ width:24,height:2,background:"var(--signal)",opacity:0.6,marginBottom:16,borderRadius:1 }} />
                <h3 style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:"clamp(1.05rem,2vw,1.25rem)",letterSpacing:"0.04em",color:"var(--chalk)",marginBottom:10 }}>{h.title}</h3>
                <p style={{ fontSize:"0.875rem",lineHeight:1.78,color:"rgba(255,255,255,0.38)" }}>{h.body}</p>
              </div>
            ))}
          </div>

          {/* Mock timer UI */}
          <div className="reveal" style={{ marginTop:"clamp(3rem,7vw,6rem)",background:"var(--card)",border:"1px solid rgba(255,107,53,0.14)",borderRadius:20,padding:"clamp(2rem,5vw,3.5rem)",maxWidth:520,marginLeft:"auto",marginRight:"auto",textAlign:"center" }}>
            <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--stone)",textTransform:"uppercase",marginBottom:8 }}>Check-in in</p>
            <div className="timer-display">14:32</div>
            <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.18em",color:"rgba(255,255,255,0.22)",textTransform:"uppercase",marginTop:12,marginBottom:24 }}>
              <span style={{ color:"var(--safe)" }}>● </span>Active · 30-min interval
            </p>
            <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
              <button className="btn btn-safe" style={{ fontSize:"0.8rem",padding:"0.6rem 1.25rem" }}>Check in now</button>
              <button className="btn btn-ghost" style={{ fontSize:"0.8rem",padding:"0.6rem 1.25rem" }}>SOS</button>
            </div>
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="section" style={{ background:"radial-gradient(ellipse 55% 50% at 10% 50%, rgba(255,107,53,0.07) 0%, transparent 60%), #0A040D" }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom:"clamp(2.5rem,6vw,5rem)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <span style={{ display:"block",width:20,height:1,background:"var(--signal)",opacity:0.55 }} />
              Pricing
            </span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:0.9,letterSpacing:"0.01em",color:"var(--chalk)" }}>
              SIMPLE.<br />PER WORKER.
            </h2>
          </div>

          <div className="pricing-grid">
            {PRICING.map((p, i) => (
              <div key={p.name} className={`price-card reveal-scale${p.featured ? " featured" : ""}`} style={{ transitionDelay:`${i*80}ms` }}>
                {p.featured && (
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,var(--signal),transparent)" }} />
                )}
                <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:"0.2em",color:p.featured?"var(--signal)":"var(--stone)",textTransform:"uppercase",marginBottom:16 }}>
                  {p.featured && "✦ "}{ p.name}
                </p>
                <div style={{ marginBottom:6 }}>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,5vw,3.5rem)",lineHeight:1,color:"var(--chalk)" }}>{p.price}</span>
                  {p.per && <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"0.6875rem",color:"var(--stone)",marginLeft:6 }}>{p.per}</span>}
                </div>
                <p style={{ fontSize:"0.8125rem",color:"rgba(255,255,255,0.38)",marginBottom:24,lineHeight:1.65 }}>{p.desc}</p>
                <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:28 }}>
                  {p.features.map((f) => (
                    <div key={f} style={{ display:"flex",alignItems:"flex-start",gap:10 }}>
                      <span style={{ color:"var(--safe)",fontSize:"0.75rem",marginTop:3,flexShrink:0 }}>✓</span>
                      <span style={{ fontSize:"0.8125rem",color:"rgba(255,255,255,0.5)",lineHeight:1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#waitlist" className={`btn ${p.featured?"btn-primary":"btn-ghost"}`} style={{ width:"100%",justifyContent:"center" }}>{p.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rule" />

      {/* ── Waitlist ───────────────────────────────────────── */}
      <section id="waitlist" className="section" style={{ background:"#08030A" }}>
        <div className="container">
          <div style={{ maxWidth:560,marginLeft:"auto",marginRight:"auto",textAlign:"center" }}>
            <div className="reveal">
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase",display:"block",marginBottom:16 }}>
                Early access
              </span>
              <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,8vw,5rem)",lineHeight:0.9,letterSpacing:"0.01em",color:"var(--chalk)",marginBottom:16 }}>
                BE FIRST<br />IN LINE.
              </h2>
              <p style={{ fontSize:"clamp(0.9rem,1.5vw,1.05rem)",color:"rgba(255,255,255,0.42)",lineHeight:1.75,marginBottom:32,maxWidth:"100%" }}>
                SafeSignal is in development. Join the waitlist for early access, founding-member pricing, and direct input into what we build first.
              </p>
            </div>
            <div className="reveal" style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:"2rem" }}>
              <a href="/checkin" className="btn btn-primary" style={{ fontSize:"1rem",padding:"1rem 2.5rem" }}>Try It Now — Start Check-In →</a>
              <a href="/dashboard" className="btn btn-safe" style={{ fontSize:"1rem",padding:"1rem 2rem" }}>View Dashboard</a>
            </div>
            {!submitted ? (
              <form className="reveal" onSubmit={(e) => { e.preventDefault(); if (waitlistEmail) setSubmitted(true); }} style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                <input
                  type="email" required placeholder="your@email.com" value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="input" style={{ flex:1,minWidth:220 }}
                />
                <button type="submit" className="btn btn-primary" style={{ flexShrink:0 }}>Join waitlist</button>
              </form>
            ) : (
              <div className="reveal in" style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"1rem",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.22)",borderRadius:12 }}>
                <div className="dot dot-safe" />
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"0.8125rem",color:"var(--safe)",letterSpacing:"0.06em" }}>You&apos;re on the list. We&apos;ll be in touch.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ background:"var(--void)",borderTop:"1px solid rgba(255,255,255,0.05)",padding:"clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,4vw,2.5rem)" }}>
        <div className="container" style={{ display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
          <div className="nav-logo" style={{ fontSize:"1.1rem" }}>Safe<span style={{ color:"var(--signal)" }}>Signal</span></div>
          <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"0.625rem",letterSpacing:"0.14em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase" }}>
            Built by Brian Josiah · 2026
          </p>
          <Link href="https://josiah-rawsignal.vercel.app" style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"0.625rem",letterSpacing:"0.14em",color:"rgba(255,255,255,0.25)",textTransform:"uppercase",transition:"color 160ms" }}
            onMouseEnter={(e)=>(e.currentTarget.style.color="var(--signal)")}
            onMouseLeave={(e)=>(e.currentTarget.style.color="rgba(255,255,255,0.25)")}
          >
            ← Portfolio
          </Link>
        </div>
      </footer>
    </>
  );
}
