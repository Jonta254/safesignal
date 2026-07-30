"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

type Phase = "setup" | "active" | "alert" | "ended";
type CheckIn = { time: string; lat?: number; lng?: number };
type GpsStatus = "idle" | "loading" | "ok" | "denied";

const RADIUS = 70;
const CIRC = 2 * Math.PI * RADIUS;

function Logo() {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#1A0A08" />
        <path d="M16 4L6 8v7c0 6 4.2 11.2 10 12.8C21.8 26.2 26 21 26 15V8L16 4z" fill="rgba(255,107,53,0.15)" stroke="#FF6B35" strokeWidth="1.3" />
        <path d="M10 17h2.5l1.5-3 2.5 6 2-4.5 1 1.5H22" stroke="#FF6B35" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="nav-logo">Safe<span style={{ color: "var(--signal)" }}>Signal</span></span>
    </Link>
  );
}

function NavBar({ activeHref }: { activeHref: string }) {
  return (
    <nav className="nav">
      <Logo />
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link
          href="/dashboard"
          style={{
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: activeHref === "/dashboard" ? "var(--chalk)" : "var(--stone)",
            textDecoration: "none",
            transition: "color 160ms",
          }}
        >
          Dashboard
        </Link>
        <Link
          href="/checkin"
          style={{
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: "0.8125rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: activeHref === "/checkin" ? "var(--signal)" : "var(--stone)",
            textDecoration: "none",
            transition: "color 160ms",
            borderBottom: activeHref === "/checkin" ? "1px solid var(--signal)" : "none",
            paddingBottom: 2,
          }}
        >
          Check In
        </Link>
      </div>
    </nav>
  );
}

export default function CheckInPage() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [workerName, setWorkerName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [interval, setIntervalMin] = useState<15 | 30 | 60>(30);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");
  const [sessionStart, setSessionStart] = useState<string>("");
  const [graceLeft, setGraceLeft] = useState(120);
  const [checkInFlash, setCheckInFlash] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const graceRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Main countdown timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setPhase("alert");
          setGraceLeft(120);
          clearInterval(timerRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Grace period countdown
  useEffect(() => {
    if (phase !== "alert") return;
    graceRef.current = setInterval(() => {
      setGraceLeft((g) => {
        if (g <= 1) {
          clearInterval(graceRef.current!);
          return 0;
        }
        return g - 1;
      });
    }, 1000);
    return () => {
      if (graceRef.current) clearInterval(graceRef.current);
    };
  }, [phase]);

  const getGps = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setGpsCoords(coords);
          resolve(coords);
        },
        () => resolve(gpsCoords),
        { timeout: 5000 }
      );
    });
  }, [gpsCoords]);

  const handleGetLocation = () => {
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("ok");
      },
      () => setGpsStatus("denied"),
      { timeout: 8000 }
    );
  };

  const startSession = () => {
    if (!workerName.trim()) return;
    const now = new Date().toISOString();
    setSessionStart(now);
    setSecondsLeft(interval * 60);
    setCheckIns([]);
    setPhase("active");
  };

  const doCheckIn = async () => {
    const coords = await getGps();
    const entry: CheckIn = {
      time: new Date().toISOString(),
      ...(coords ? { lat: coords.lat, lng: coords.lng } : {}),
    };
    setCheckIns((prev) => {
      const updated = [entry, ...prev];
      // Persist to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("ss_sessions") || "[]");
        stored.unshift({ worker: workerName, site: siteName, interval, checkIns: updated, sessionStart });
        localStorage.setItem("ss_sessions", JSON.stringify(stored.slice(0, 20)));
      } catch {}
      return updated;
    });
    setSecondsLeft(interval * 60);
    setCheckInFlash(true);
    setTimeout(() => setCheckInFlash(false), 1800);
  };

  const doCheckInFromAlert = async () => {
    if (graceRef.current) clearInterval(graceRef.current);
    await doCheckIn();
    setPhase("active");
  };

  const endSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (graceRef.current) clearInterval(graceRef.current);
    setPhase("ended");
  };

  const startNew = () => {
    setPhase("setup");
    setWorkerName("");
    setSiteName("");
    setIntervalMin(30);
    setSecondsLeft(30 * 60);
    setCheckIns([]);
    setGpsCoords(null);
    setGpsStatus("idle");
    setSessionStart("");
  };

  const copyLog = () => {
    const lines = [
      `SafeSignal Session Log`,
      `Worker: ${workerName}`,
      `Site: ${siteName}`,
      `Interval: ${interval} min`,
      `Started: ${sessionStart ? new Date(sessionStart).toLocaleString() : "—"}`,
      `Total check-ins: ${checkIns.length}`,
      ``,
      ...checkIns.map((c, i) =>
        `#${i + 1}  ${new Date(c.time).toLocaleTimeString()}${c.lat != null ? `  GPS: ${c.lat.toFixed(5)},${c.lng?.toFixed(5)}` : ""}`
      ),
    ];
    navigator.clipboard.writeText(lines.join("\n")).catch(() => {});
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progress = secondsLeft / (interval * 60);
  const dash = CIRC * progress;
  const ringColor =
    secondsLeft < interval * 60 * 0.2
      ? "var(--alert)"
      : secondsLeft < interval * 60 * 0.4
      ? "var(--gold)"
      : "var(--safe)";

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "var(--void)",
    paddingTop: 62,
  };

  const innerStyle: React.CSSProperties = {
    maxWidth: 680,
    margin: "0 auto",
    padding: "2.5rem 1.25rem 4rem",
  };

  // ── SETUP PHASE ──────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <>
        <NavBar activeHref="/checkin" />
        <div style={pageStyle}>
          <div style={innerStyle}>
            {/* Header */}
            <div style={{ marginBottom: "2rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.22em", color: "var(--signal)", textTransform: "uppercase" }}>
                // Start session
              </span>
              <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,8vw,4rem)", lineHeight: 0.95, color: "var(--chalk)", marginTop: 8 }}>
                Set Up Your<br />
                <span style={{ color: "var(--signal)" }}>Check-In Session</span>
              </h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.75, marginTop: 12 }}>
                Fill in your details and choose a check-in interval. Miss one and this device raises an overdue alarm with a grace-period countdown to confirm you&apos;re OK.
              </p>
            </div>

            {/* Form card */}
            <div className="card" style={{ padding: "2rem" }}>
              {/* Worker name */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 8 }}>
                  Your Name <span style={{ color: "var(--alert)" }}>*</span>
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Marcus Webb"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                />
              </div>

              {/* Site */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "block", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 8 }}>
                  Site / Location
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Plant Room B – Level 2"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
              </div>

              {/* Interval */}
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "block", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 12 }}>
                  Check-in Interval
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  {([15, 30, 60] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setIntervalMin(m); setSecondsLeft(m * 60); }}
                      style={{
                        flex: 1,
                        padding: "0.75rem",
                        borderRadius: 10,
                        border: interval === m ? "1px solid var(--signal)" : "1px solid rgba(255,255,255,0.09)",
                        background: interval === m ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.03)",
                        color: interval === m ? "var(--signal)" : "var(--stone)",
                        fontFamily: "'Rajdhani',sans-serif",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        transition: "all 180ms",
                      }}
                    >
                      {m} MIN
                    </button>
                  ))}
                </div>
              </div>

              {/* GPS */}
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--stone)", marginBottom: 8 }}>
                  Location (optional)
                </label>
                <button
                  onClick={handleGetLocation}
                  disabled={gpsStatus === "loading"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0.75rem 1.25rem",
                    borderRadius: 10,
                    border: gpsStatus === "ok" ? "1px solid rgba(52,211,153,0.4)" : gpsStatus === "denied" ? "1px solid rgba(255,59,59,0.3)" : "1px solid rgba(255,255,255,0.09)",
                    background: gpsStatus === "ok" ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.03)",
                    color: gpsStatus === "ok" ? "var(--safe)" : gpsStatus === "denied" ? "var(--alert)" : "var(--stone)",
                    fontFamily: "'Rajdhani',sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: gpsStatus === "loading" ? "wait" : "pointer",
                    transition: "all 180ms",
                  }}
                >
                  <span>{gpsStatus === "loading" ? "📡" : gpsStatus === "ok" ? "✓" : gpsStatus === "denied" ? "✗" : "📍"}</span>
                  {gpsStatus === "idle" && "Get Location"}
                  {gpsStatus === "loading" && "Acquiring GPS..."}
                  {gpsStatus === "ok" && gpsCoords && `${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}`}
                  {gpsStatus === "denied" && "Location denied"}
                </button>
              </div>

              {/* Start button */}
              <button
                className="btn btn-primary"
                onClick={startSession}
                disabled={!workerName.trim()}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1rem",
                  padding: "1rem",
                  opacity: workerName.trim() ? 1 : 0.45,
                  cursor: workerName.trim() ? "pointer" : "not-allowed",
                }}
              >
                START SESSION
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── ACTIVE PHASE ─────────────────────────────────────────────
  if (phase === "active") {
    return (
      <>
        <NavBar activeHref="/checkin" />
        <div style={pageStyle}>
          <div style={innerStyle}>
            {/* Status bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
              <div className="dot dot-safe" />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--safe)" }}>
                Session Active
              </span>
              <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "var(--mist)", letterSpacing: "0.1em" }}>
                {interval} MIN INTERVAL
              </span>
            </div>

            {/* Timer ring + display */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
              <div style={{ position: "relative", width: 180, height: 180 }}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle
                    cx="90" cy="90" r={RADIUS} fill="none"
                    stroke={ringColor}
                    strokeWidth="8"
                    strokeDasharray={`${dash} ${CIRC}`}
                    strokeLinecap="round"
                    transform="rotate(-90 90 90)"
                    style={{ transition: "stroke-dasharray 1s linear, stroke 0.5s" }}
                  />
                </svg>
                <div style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <div className="timer-display" style={{ fontSize: "2.2rem" }}>
                    {fmt(secondsLeft)}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.12em", color: "var(--mist)", textTransform: "uppercase", marginTop: 4 }}>
                    remaining
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mist)", marginTop: 12 }}>
                Next check-in required in {fmt(secondsLeft)}
              </p>
            </div>

            {/* Check in button */}
            <button
              onClick={doCheckIn}
              style={{
                width: "100%",
                padding: "1.1rem",
                borderRadius: 14,
                border: checkInFlash ? "1px solid rgba(52,211,153,0.6)" : "1px solid rgba(52,211,153,0.3)",
                background: checkInFlash ? "rgba(52,211,153,0.2)" : "rgba(52,211,153,0.1)",
                color: "var(--safe)",
                fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 800,
                fontSize: "1.125rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 200ms",
                marginBottom: "1.25rem",
              }}
            >
              {checkInFlash ? "✓  Checked In" : "CHECK IN NOW"}
            </button>

            {/* Session stats */}
            <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { label: "Worker", value: workerName },
                  { label: "Site", value: siteName || "—" },
                  { label: "Started", value: sessionStart ? new Date(sessionStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" },
                  { label: "Check-ins", value: checkIns.length.toString() },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mist)", marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--chalk)", letterSpacing: "0.02em" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in log */}
            {checkIns.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mist)", marginBottom: 10 }}>
                  Recent Check-ins
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {checkIns.slice(0, 3).map((c, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: 8, padding: "0.6rem 0.875rem",
                    }}>
                      <span style={{ color: "var(--safe)", fontSize: "0.75rem" }}>✓</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", color: "var(--chalk)" }}>
                        {new Date(c.time).toLocaleTimeString()}
                      </span>
                      {c.lat != null && (
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "var(--mist)", marginLeft: "auto" }}>
                          {c.lat.toFixed(4)},{c.lng?.toFixed(4)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* End session */}
            <button
              className="btn btn-ghost"
              onClick={endSession}
              style={{ width: "100%", justifyContent: "center", fontSize: "0.8125rem" }}
            >
              End Session
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── ALERT PHASE ──────────────────────────────────────────────
  if (phase === "alert") {
    return (
      <>
        <NavBar activeHref="/checkin" />
        <div style={{
          ...pageStyle,
          background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(255,59,59,0.14) 0%, var(--void) 65%)",
        }}>
          <div style={innerStyle}>
            {/* Alert banner */}
            <div style={{
              border: "1px solid rgba(255,59,59,0.4)",
              background: "rgba(255,59,59,0.07)",
              borderRadius: 16,
              padding: "2rem",
              textAlign: "center",
              marginBottom: "1.5rem",
              animation: "alert-pulse 2s ease-in-out infinite",
            }}>
              <style>{`
                @keyframes alert-pulse {
                  0%,100%{box-shadow:0 0 0 0 rgba(255,59,59,0.2)}
                  50%{box-shadow:0 0 40px 8px rgba(255,59,59,0.12)}
                }
              `}</style>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>⚠</div>
              <h1 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(2rem,7vw,3.5rem)",
                lineHeight: 0.95,
                color: "var(--alert)",
                marginBottom: 16,
              }}>
                CHECK-IN OVERDUE
              </h1>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: "1.25rem" }}>
                Confirm you&apos;re OK before the grace period ends
              </p>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "clamp(3rem,12vw,5rem)",
                color: "var(--alert)",
                lineHeight: 1,
                textShadow: "0 0 40px rgba(255,59,59,0.4)",
                marginBottom: "0.5rem",
                animation: graceLeft <= 30 ? "timer-flash 0.7s ease-in-out infinite" : "none",
              }}>
                {fmt(graceLeft)}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: "0.14em", color: "var(--mist)", textTransform: "uppercase" }}>
                Grace period remaining
              </div>
            </div>

            {/* GPS if available */}
            {gpsCoords && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1.25rem",
              }}>
                <span style={{ fontSize: "0.875rem" }}>📍</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", color: "var(--stone)" }}>
                  Last known: {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}
                </span>
              </div>
            )}

            {/* Check-in button */}
            <button
              onClick={doCheckInFromAlert}
              style={{
                width: "100%",
                padding: "1.25rem",
                borderRadius: 14,
                border: "2px solid rgba(52,211,153,0.5)",
                background: "rgba(52,211,153,0.12)",
                color: "var(--safe)",
                fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 800,
                fontSize: "1.2rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 200ms",
                marginBottom: "1rem",
              }}
            >
              CHECK IN NOW — I&apos;M OK
            </button>

            <button
              className="btn btn-ghost"
              onClick={endSession}
              style={{ width: "100%", justifyContent: "center", fontSize: "0.8125rem" }}
            >
              End Session
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── ENDED PHASE ──────────────────────────────────────────────
  const sessionDuration = sessionStart
    ? Math.round((Date.now() - new Date(sessionStart).getTime()) / 60000)
    : 0;

  return (
    <>
      <NavBar activeHref="/checkin" />
      <div style={pageStyle}>
        <div style={innerStyle}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✓</div>
            <h1 style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(2.5rem,8vw,4rem)",
              color: "var(--chalk)",
              lineHeight: 0.95,
              marginBottom: 12,
            }}>
              Session Complete
            </h1>
            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.75 }}>
              Your lone worker session has ended. Stay safe.
            </p>
          </div>

          {/* Summary card */}
          <div className="card card-safe" style={{ padding: "1.75rem", marginBottom: "1.25rem" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mist)", marginBottom: "1rem" }}>
              Session Summary
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              {[
                { label: "Worker", value: workerName },
                { label: "Site", value: siteName || "—" },
                { label: "Duration", value: `${sessionDuration} min` },
                { label: "Total Check-ins", value: checkIns.length.toString() },
                { label: "Interval", value: `${interval} min` },
                { label: "Started", value: sessionStart ? new Date(sessionStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mist)", marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--chalk)" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in log */}
          {checkIns.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mist)", marginBottom: 10 }}>
                Full Check-in Log
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {checkIns.map((c, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 8, padding: "0.6rem 0.875rem",
                  }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", color: "var(--mist)", minWidth: 24 }}>
                      #{checkIns.length - i}
                    </span>
                    <span style={{ color: "var(--safe)", fontSize: "0.75rem" }}>✓</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", color: "var(--chalk)" }}>
                      {new Date(c.time).toLocaleTimeString()}
                    </span>
                    {c.lat != null && (
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.65rem", color: "var(--mist)", marginLeft: "auto" }}>
                        {c.lat.toFixed(4)},{c.lng?.toFixed(4)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
            <button
              onClick={copyLog}
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Copy Log to Clipboard
            </button>
            <button
              onClick={startNew}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
