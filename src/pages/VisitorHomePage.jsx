import { useEffect, useRef, useState } from "react";
import IdleTimer from "../components/IdleTimer";

const companyPhotos = [
  { bg: "from-blue-900/60 to-indigo-900/60", icon: "🏛️", label: "Our Office" },
  { bg: "from-emerald-900/60 to-teal-900/60", icon: "👥", label: "Our Team" },
  { bg: "from-purple-900/60 to-violet-900/60", icon: "💡", label: "Innovation Hub" },
  { bg: "from-amber-900/60 to-orange-900/60", icon: "🤝", label: "Client Success" },
];

const stats = [
  { value: "500+", label: "Happy Clients" },
  { value: "15+", label: "Years Experience" },
  { value: "200+", label: "Team Members" },
  { value: "20+", label: "Countries" },
];

export default function VisitorHomePage({ onCheckIn, onWaitingList, waitingCount, onIdle }) {
  const [time, setTime] = useState(new Date());
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActivePhoto((p) => (p + 1) % companyPhotos.length), 3500);
    return () => clearInterval(t);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const formattedDate = time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <IdleTimer onIdle={onIdle} timeout={60000}>
      <div
        className="relative w-full h-full flex flex-col overflow-hidden"
      >
        {/* Background blobs */}
        <div className="blob w-80 h-80 bg-blue-800" style={{ top: "-5%", right: "10%", animationDelay: "0s" }} />
        <div className="blob w-60 h-60" style={{ bottom: "10%", left: "-5%", animationDelay: "2s", background: "#FF6829" }} />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,104,41,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,104,41,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* ─── TOP BAR ─── */}
        <div className="relative z-20 flex items-start justify-between px-6 pt-5">
          {/* LEFT: Waiting List Button */}
          <button
            onClick={onWaitingList}
            className="corner-btn glass text-white hover:border-white/20 active:scale-95 relative"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Waiting List</span>
            {waitingCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: "#FF6829", color: "#0a0f1e" }}>
                {waitingCount}
              </span>
            )}
          </button>

          {/* CENTER: Time */}
          <div className="text-center">
            <p className="font-display text-4xl font-bold" style={{ color: "#FF6829" }}>{formattedTime}</p>
            <p className="text-white/40 font-body text-xs mt-0.5">{formattedDate}</p>
          </div>

          {/* RIGHT: Check In Button */}
          <button
            onClick={onCheckIn}
            className="corner-btn active:scale-95"
            style={{
              background: "linear-gradient(135deg, #e05520, #FF6829)",
              color: "#0a0f1e",
              fontWeight: "600",
              boxShadow: "0 4px 20px rgba(255,104,41,0.35)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            <span>Check In</span>
          </button>
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-6">
          {/* Company name + tagline */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to right, transparent, rgba(255,104,41,0.5))" }} />
              <span className="font-body text-sm tracking-[0.3em] uppercase font-medium" style={{ color: "#FF6829" }}>Welcome To</span>
              <div className="h-px flex-1 max-w-16" style={{ background: "linear-gradient(to left, transparent, rgba(255,104,41,0.5))" }} />
            </div>
            <h1 className="font-display text-7xl font-bold leading-none mb-3" style={{ color: "#3D6BC0" }}>
              WIZZYBOX
            </h1>
            <p className="font-body text-xl font-light italic" style={{ color: "#3D6BC0", opacity: 0.75 }}>Pvt. Ltd.</p>
          </div>

          {/* Photo gallery + Vision/Mission row */}
          <div className="w-full max-w-4xl grid grid-cols-3 gap-4">
            {/* Photo Carousel */}
            <div className="col-span-2 rounded-2xl overflow-hidden relative" style={{ height: "240px" }}>
              {companyPhotos.map((photo, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${photo.bg} transition-all duration-700`}
                  style={{
                    opacity: i === activePhoto ? 1 : 0,
                    transform: i === activePhoto ? "scale(1)" : "scale(1.05)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-7xl mb-3">{photo.icon}</span>
                  <span className="text-white/80 font-body text-base tracking-wider">{photo.label}</span>
                </div>
              ))}
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {companyPhotos.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: i === activePhoto ? "20px" : "6px",
                      background: i === activePhoto ? "#FF6829" : "rgba(255,255,255,0.3)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="flex flex-col gap-3">
              <div className="glass rounded-2xl p-5 flex-1" style={{ border: "1px solid rgba(255,104,41,0.15)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" style={{ color: "#FF6829" }}>🎯</span>
                  <span className="font-body text-xs tracking-widest uppercase font-semibold" style={{ color: "#FF6829" }}>Vision</span>
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#3D6BC0", opacity: 0.85 }}>
                  To be the world's most trusted technology partner, empowering organizations to thrive.
                </p>
              </div>
              <div className="glass rounded-2xl p-5 flex-1" style={{ border: "1px solid rgba(255,104,41,0.15)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" style={{ color: "#FF6829" }}>🌟</span>
                  <span className="font-body text-xs tracking-widest uppercase font-semibold" style={{ color: "#FF6829" }}>Mission</span>
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#3D6BC0", opacity: 0.85 }}>
                  Delivering innovative, reliable solutions with integrity, agility, and a human touch.
                </p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="w-full max-w-4xl grid grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass rounded-2xl py-4 px-3 text-center"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="font-display text-3xl font-bold" style={{ color: "#FF6829" }}>{stat.value}</p>
                <p className="font-body text-xs mt-1 tracking-wide" style={{ color: "#3D6BC0", opacity: 0.6 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="relative z-10 pb-5 text-center">
          <p className="text-white/25 font-body text-xs tracking-widest uppercase">
            Tap <span style={{ color: "rgba(255,104,41,0.5)" }}>Check In</span> to register your visit
          </p>
        </div>
      </div>
    </IdleTimer>
  );
}