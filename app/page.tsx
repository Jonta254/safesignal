"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: "timer",
    title: "Dead-man check-ins",
    desc: "Choose a 15, 30, or 60-minute interval. The countdown runs on your device — miss it and it raises an overdue alarm with a grace period to confirm you're OK.",
    color: "var(--signal)",
  },
  {
    icon: "pin",
    title: "GPS on every check-in",
    desc: "Each check-in records your exact coordinates next to the timestamp, so your session log shows where you were — not just that you checked in.",
    color: "var(--cyan)",
  },
  {
    icon: "bell",
    title: "Escalation preview",
    desc: "A missed check-in shows exactly what would happen next — grace period, then your emergency contact, step by step. Automated dispatch is on the roadmap; today it's an honest preview, never a silent promise.",
    color: "var(--alert)",
  },
  {
    icon: "contact",
    title: "Emergency contact",
    desc: "Name the person who should be reached if you go quiet. Stored on your device and shown in the escalation preview, so you know the plan before you ever need it.",
    color: "var(--gold)",
  },
  {
    icon: "grid",
    title: "Supervisor view",
    desc: "A team dashboard of who's checked in, who's late, and who's overdue — shown with clearly-labelled sample data as a preview of the supervisor experience.",
    color: "var(--safe)",
  },
  {
    icon: "doc",
    title: "Session export",
    desc: "End a session and download a timestamped report of every check-in, with GPS and duration — plain text you can keep for your own records.",
    color: "var(--cyan)",
  },
];

const INDUSTRIES = [
  { icon:"⚡", name:"Electrical", detail:"Panel work, live circuits, confined plant rooms — exactly where no one should be alone and without a check-in timer.", color:"var(--gold)" },
  { icon:"🔩", name:"Mechanical & HVAC", detail:"Rooftop plant, confined boiler rooms, pressurised systems. One failure with no one watching is one too many.", color:"var(--signal)" },
  { icon:"🏗️", name:"Construction", detail:"Working at height, below grade, in partially built structures. Site safety ends where mobile signal does — unless you have a system.", color:"var(--cyan)" },
  { icon:"🛢️", name:"Oil & Gas", detail:"Remote pipeline patrols, substation checks, tank farms — often hours from the nearest help if something goes wrong.", color:"var(--safe)" },
  { icon:"🚿", name:"Utilities", detail:"Water treatment, substations, remote pump stations visited solo — routine work that turns serious the moment no one knows you're in trouble.", color:"var(--stone)" },
  { icon:"🔒", name:"Security & Facilities", detail:"Night patrols, single-guard buildings, remote site checks. Your guard shouldn't have to rely on a walkie-talkie from 1994.", color:"var(--alert)" },
];

const DUTY = [
  { k:"01", title:"A duty of care", body:"Wherever people work alone, employers carry a responsibility to protect them from foreseeable harm. It's a baseline expectation of decent work — not a regional add-on.", color:"var(--signal)" },
  { k:"02", title:"Assess, then control the risk", body:"Occupational health-and-safety practice — reflected in frameworks like ISO 45001 — expects the risks of lone and remote work to be identified, assessed, and actively managed.", color:"var(--gold)" },
  { k:"03", title:"Know they're safe — fast", body:"A credible system means someone knows a lone worker is OK, knows where they are, and knows quickly when they're not. Silence should never be the only signal.", color:"var(--safe)" },
];

const HOW = [
  { n: "01", title: "Start a session", body: "Enter your name and site, add an emergency contact, choose a check-in interval, and tap Start. The countdown begins." },
  { n: "02", title: "Check in each interval", body: "Before the timer hits zero, tap once to log the time and your GPS location and reset the countdown." },
  { n: "03", title: "Miss one — the alarm sounds", body: "The device raises an overdue alarm and a grace period. The escalation preview shows exactly who would be alerted, and when." },
];

const PRICING = [
  {
    name: "Solo",
    price: "$8",
    per: "worker / month",
    desc: "For independent trade workers who need personal protection.",
    features: ["On-device check-in timer (15 / 30 / 60 min)", "GPS logged on every check-in", "Emergency contact + escalation preview", "Automated SMS + call escalation", "Session history & timestamped export"],
    cta: "Join the waitlist",
    featured: false,
  },
  {
    name: "Team",
    price: "$14",
    per: "worker / month",
    desc: "For companies with field workers. Supervisor dashboard included.",
    features: ["Everything in Solo", "Live supervisor dashboard", "Unlimited emergency contacts", "Custom escalation rules", "Records export for compliance", "Admin controls + team management"],
    cta: "Join the waitlist",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Talk to us",
    per: "",
    desc: "For large contractors and staffing companies with 50+ workers.",
    features: ["Everything in Team", "SSO + custom integrations", "API access", "Dedicated account manager", "SLA + uptime guarantee", "Custom compliance reporting"],
    cta: "Register interest",
    featured: false,
  },
];

function FeatureIcon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const svg = { width: 22, height: 22, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (name) {
    case "timer":
      return (<svg {...svg}><circle cx="12" cy="13.5" r="7.5" {...p} /><path d="M12 13.5V9.5" {...p} /><path d="M9.5 2.5h5" {...p} /><path d="M12 5V2.5" {...p} /></svg>);
    case "pin":
      return (<svg {...svg}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" {...p} /><circle cx="12" cy="10" r="2.5" {...p} /></svg>);
    case "bell":
      return (<svg {...svg}><path d="M18 8.5a6 6 0 1 0-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5" {...p} /><path d="M10.2 20.5a2 2 0 0 0 3.6 0" {...p} /></svg>);
    case "contact":
      return (<svg {...svg}><rect x="3" y="5" width="18" height="14" rx="2" {...p} /><circle cx="9" cy="11" r="2" {...p} /><path d="M6 16c.4-1.5 1.6-2.3 3-2.3s2.6.8 3 2.3" {...p} /><path d="M14.5 10h3.5M14.5 13h3" {...p} /></svg>);
    case "grid":
      return (<svg {...svg}><rect x="3" y="3" width="7.5" height="7.5" rx="1.4" {...p} /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.4" {...p} /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.4" {...p} /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.4" {...p} /></svg>);
    case "doc":
      return (<svg {...svg}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" {...p} /><path d="M14 3v5h5" {...p} /><path d="M9 13h6M9 16.5h6" {...p} /></svg>);
    default:
      return null;
  }
}

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
            A dead-man&apos;s timer for people who work alone. On-device check-in countdowns, GPS logged on every check-in, and a clear escalation plan for the moment one is missed — because no one should work inside a live panel with nobody knowing where they are.
          </p>

          <div className="reveal" style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
            <a href="/checkin" className="btn btn-primary">Start Check-In Now →</a>
            <a href="/dashboard" className="btn btn-ghost">View Dashboard</a>
          </div>

          {/* Social proof */}
          <div className="reveal" style={{ marginTop:"clamp(2rem,5vw,3.5rem)",display:"flex",alignItems:"center",gap:"clamp(1rem,3vw,2rem)",flexWrap:"wrap" }}>
            {[
              { n: "Timed", label: "Countdown check-in intervals" },
              { n: "GPS", label: "Logged on every check-in" },
              { n: "Overdue", label: "On-screen alert + grace timer" },
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
                <div style={{ width:44,height:44,borderRadius:12,background:`${f.color}14`,border:`1px solid ${f.color}28`,display:"flex",alignItems:"center",justifyContent:"center",color:f.color,marginBottom:16 }}>
                  <FeatureIcon name={f.icon} />
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

      {/* ── Why it's regulated ─────────────────────────────── */}
      <section className="section" style={{ background:"radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,107,53,0.06) 0%, transparent 60%), #0A040D", paddingTop:"clamp(2.5rem,6vw,5rem)" }}>
        <div className="container">
          <div className="reveal" style={{ marginBottom:"clamp(2rem,5vw,4rem)" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--signal)",textTransform:"uppercase",display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
              <span style={{ display:"block",width:20,height:1,background:"var(--signal)",opacity:0.55 }} />
              Why it matters
            </span>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.5rem,7vw,5.5rem)",lineHeight:0.9,letterSpacing:"0.01em",color:"var(--chalk)" }}>
              WORKING ALONE IS<br />A DUTY OF CARE.
            </h2>
            <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(1rem,2vw,1.25rem)",color:"rgba(255,255,255,0.35)",marginTop:"0.75rem",fontWeight:500,maxWidth:640 }}>
              Everywhere people work alone, protecting them is a shared responsibility — a principle that runs through occupational safety standards the world over, not a box to tick in one country.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,300px),1fr))",gap:"1.25rem" }}>
            {DUTY.map((d, i) => (
              <div key={d.k} className="card reveal-scale" style={{ padding:"2rem",transitionDelay:`${i*70}ms`,borderColor:`${d.color}22`,position:"relative",overflow:"hidden" }}>
                <div aria-hidden style={{ position:"absolute",top:-8,right:14,fontFamily:"'Bebas Neue',sans-serif",fontSize:"4.5rem",lineHeight:1,color:`${d.color}14` }}>{d.k}</div>
                <div style={{ width:28,height:2,background:d.color,opacity:0.7,marginBottom:16,borderRadius:1 }} />
                <div style={{ fontFamily:"'Rajdhani',sans-serif",fontWeight:800,fontSize:"1.15rem",letterSpacing:"0.03em",color:"var(--chalk)",marginBottom:"0.75rem",position:"relative" }}>{d.title}</div>
                <p style={{ fontSize:"0.85rem",lineHeight:1.8,color:"rgba(255,255,255,0.5)",position:"relative" }}>{d.body}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.08em",color:"rgba(255,255,255,0.25)",marginTop:"1.5rem",lineHeight:1.8,maxWidth:760 }}>
            SafeSignal is a safety tool, not legal advice. The specific rules for lone and remote work differ by country, industry, and role, and they change over time — always confirm the requirements that apply to your own location and work.
          </p>
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

          {/* Live tool preview */}
          <div className="reveal" style={{ marginTop:"clamp(3rem,7vw,6rem)",background:"var(--card)",border:"1px solid rgba(255,107,53,0.14)",borderRadius:20,padding:"clamp(2rem,5vw,3.5rem)",maxWidth:520,marginLeft:"auto",marginRight:"auto",textAlign:"center",position:"relative" }}>
            <span style={{ position:"absolute",top:14,right:14,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:"0.14em",color:"var(--signal)",textTransform:"uppercase",background:"rgba(255,107,53,0.10)",border:"1px solid rgba(255,107,53,0.25)",borderRadius:100,padding:"3px 9px" }}>Live preview</span>
            <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.22em",color:"var(--stone)",textTransform:"uppercase",marginBottom:8 }}>Next check-in in</p>
            <div className="timer-display">14:32</div>
            <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.18em",color:"rgba(255,255,255,0.22)",textTransform:"uppercase",marginTop:12,marginBottom:24 }}>
              <span style={{ color:"var(--safe)" }}>● </span>Active · 30-min interval
            </p>
            <a href="/checkin" className="btn btn-safe" style={{ fontSize:"0.8rem",padding:"0.6rem 1.5rem" }}>Open the check-in tool →</a>
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
            <p style={{ fontFamily:"'Rajdhani',sans-serif",fontSize:"clamp(1rem,2vw,1.2rem)",color:"rgba(255,255,255,0.35)",marginTop:"0.75rem",fontWeight:500,maxWidth:600 }}>
              SafeSignal is in development. These plans describe the product we&apos;re building — nothing is charged today. The on-device check-in tool is free to try right now; automated SMS &amp; call escalation ships with the paid service.
            </p>
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
