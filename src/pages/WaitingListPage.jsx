import { useState } from "react";

export default function WaitingListPage({ visitors, onExit, onBack }) {
  const [exitingId, setExitingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const handleExitClick = (id) => {
    setConfirmId(id);
  };

  const handleConfirmExit = (id) => {
    setExitingId(id);
    setTimeout(() => {
      onExit(id);
      setExitingId(null);
      setConfirmId(null);
    }, 500);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* BG blobs */}
      <div className="blob w-72 h-72 bg-purple-800" style={{ top: "-10%", right: "-5%", animationDelay: "0s" }} />
      <div className="blob w-56 h-56" style={{ bottom: "0%", left: "-5%", animationDelay: "2.5s", background: "#FF6829" }} />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,104,41,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,104,41,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-5 pb-4">
        <button
          onClick={onBack}
          className="corner-btn glass text-white/70 hover:text-white"
          style={{ position: "relative", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div className="text-center">
          <h1 className="font-display text-3xl font-bold" style={{ color: "#FF6829" }}>Waiting Visitors</h1>
          <p className="font-body text-xs mt-0.5" style={{ color: "#3D6BC0", opacity: 0.7 }}>
            {visitors.length === 0
              ? "No visitors currently waiting"
              : `${visitors.length} visitor${visitors.length > 1 ? "s" : ""} waiting`}
          </p>
        </div>

        {/* Badge */}
        <div
          className="px-5 py-3 rounded-xl text-center"
          style={{ background: "rgba(255,104,41,0.1)", border: "1px solid rgba(255,104,41,0.25)" }}
        >
          <p className="font-display text-3xl font-bold leading-none" style={{ color: "#FF6829" }}>{visitors.length}</p>
          <p className="font-body text-xs mt-0.5" style={{ color: "#3D6BC0", opacity: 0.6 }}>Waiting</p>
        </div>
      </div>

      {/* ─── VISITOR CARDS ─── */}
      <div className="relative z-10 flex-1 overflow-y-auto custom-scroll px-8 pb-6">
        {visitors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              🪑
            </div>
            <p className="font-body text-lg" style={{ color: "#3D6BC0", opacity: 0.5 }}>No visitors waiting right now</p>
            <p className="font-body text-sm" style={{ color: "#3D6BC0", opacity: 0.3 }}>Visitors who check in will appear here</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {visitors.map((visitor, index) => (
              <VisitorCard
                key={visitor.id}
                visitor={visitor}
                index={index}
                isExiting={exitingId === visitor.id}
                isConfirming={confirmId === visitor.id}
                onExitClick={() => handleExitClick(visitor.id)}
                onConfirmExit={() => handleConfirmExit(visitor.id)}
                onCancelExit={() => setConfirmId(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VisitorCard({ visitor, index, isExiting, isConfirming, onExitClick, onConfirmExit, onCancelExit }) {
  return (
    <div
      className="glass rounded-2xl p-5 flex items-center gap-5 transition-all duration-500"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "translateX(60px)" : "translateX(0)",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Photo or Avatar */}
      <div className="flex-shrink-0 relative">
        {visitor.photo ? (
          <img
            src={visitor.photo}
            alt={visitor.visitorName}
            className="w-16 h-16 rounded-xl object-cover"
            style={{ border: "2px solid rgba(255,104,41,0.35)" }}
          />
        ) : (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-display font-bold"
            style={{
              background: "linear-gradient(135deg, rgba(255,104,41,0.2), rgba(255,104,41,0.05))",
              border: "2px solid rgba(255,104,41,0.25)",
              color: "#FF6829",
            }}
          >
            {visitor.visitorName?.[0]?.toUpperCase()}
          </div>
        )}
        {/* Status dot */}
        <div
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full"
          style={{ background: "#f59e0b", border: "2px solid #0d1530" }}
          title="Waiting"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-body font-semibold text-lg truncate" style={{ color: "#3D6BC0" }}>{visitor.visitorName}</h3>
          {visitor.company && (
            <span
              className="px-2 py-0.5 rounded-full font-body text-xs flex-shrink-0"
              style={{ background: "rgba(61,107,192,0.1)", color: "rgba(61,107,192,0.7)" }}
            >
              {visitor.company}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <InfoChip icon="🎯" text={visitor.purpose} />
          <InfoChip icon="👤" text={`Meeting: ${visitor.whomToMeet}`} highlight />
          <InfoChip icon="🕐" text={`In: ${visitor.checkInTime}`} />
          {visitor.phone && <InfoChip icon="📱" text={visitor.phone} />}
        </div>
      </div>

      {/* Exit section */}
      <div className="flex-shrink-0">
        {isConfirming ? (
          <div className="flex flex-col items-end gap-2">
            <p className="font-body text-xs text-right" style={{ color: "#3D6BC0", opacity: 0.7 }}>Confirm exit?</p>
            <div className="flex gap-2">
              <button
                onClick={onCancelExit}
                className="px-3 py-2 rounded-lg font-body text-xs font-medium transition-all active:scale-95"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#3D6BC0" }}
              >
                Cancel
              </button>
              <button
                onClick={onConfirmExit}
                className="px-3 py-2 rounded-lg font-body text-xs font-semibold transition-all active:scale-95"
                style={{ background: "#dc2626", color: "white" }}
              >
                Confirm Exit
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onExitClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 active:scale-95"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Exit
          </button>
        )}
      </div>
    </div>
  );
}

function InfoChip({ icon, text, highlight }) {
  return (
    <span
      className="flex items-center gap-1 font-body text-xs"
      style={{ color: highlight ? "#FF6829" : "rgba(61,107,192,0.6)" }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  );
}