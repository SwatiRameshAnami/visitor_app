import { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import FeedBackFormPage from "./FeedBackFormPage";
import { getWaitingVisitors, checkOutVisitor } from "../services/apiServices";

export default function WaitingListPage({ onBack }) {
  const [visitors, setVisitors] = useState([]);
  const [exitingId, setExitingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [exitedVisitor, setExitedVisitor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWaitingList();
  }, []);

  const fetchWaitingList = async () => {
    try {
      const data = await getWaitingVisitors();
      setVisitors(data);
    } catch (err) {
      console.error("Failed to fetch waiting visitors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExitClick = (id) => {
    setConfirmId(id);
  };

  const handleConfirmExit = async (visitor) => {
    setExitingId(visitor.id);

    try {
      await checkOutVisitor(visitor.id);
      
      setTimeout(() => {
        setVisitors((prev) => prev.filter((v) => v.id !== visitor.id));
        setExitedVisitor(visitor);
        setShowFeedback(true);
        setExitingId(null);
        setConfirmId(null);
      }, 500);
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Failed to check out visitor. Please try again.");
      setExitingId(null);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col overflow-hidden">
      <BackButton onClick={onBack} />

      <div className={`flex flex-col h-full ${showFeedback ? "blur-sm pointer-events-none" : ""}`}>
        {/* Background Blobs */}
        <div className="blob w-72 h-72 bg-purple-800" style={{ top: "-10%", right: "-5%", animationDelay: "0s" }} />
        <div className="blob w-56 h-56" style={{ bottom: "0%", left: "-5%", animationDelay: "2.5s", background: "#FF6829" }} />

        {/* Header Section */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-5 pb-4">
          <div className="w-10" />
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold" style={{ color: "#FF6829" }}>
              Waiting Visitors
            </h1>
            <p className="font-body text-xs mt-0.5" style={{ color: "#3D6BC0", opacity: 0.7 }}>
              {isLoading ? "Loading..." : visitors.length === 0 ? "No visitors currently waiting" : `${visitors.length} visitor${visitors.length > 1 ? "s" : ""} waiting`}
            </p>
          </div>

          <div className="px-5 py-3 rounded-xl text-center" style={{ background: "rgba(255,104,41,0.1)", border: "1px solid rgba(255,104,41,0.25)" }}>
            <p className="font-display text-3xl font-bold leading-none" style={{ color: "#FF6829" }}>
              {visitors.length}
            </p>
            <p className="font-body text-xs mt-0.5" style={{ color: "#3D6BC0", opacity: 0.6 }}>
              Waiting
            </p>
          </div>
        </div>

        {/* Scrollable Container with Hidden Scrollbar */}
        <div 
          className="relative z-10 flex-1 overflow-y-auto px-8 pb-10 scroll-smooth no-scrollbar" 
          style={{ 
            maxHeight: "calc(100vh - 120px)",
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none' /* IE and Edge */
          }}
        >
          {/* Webkit specific style for Chrome/Safari/Brave */}
          <style>
            {`.no-scrollbar::-webkit-scrollbar { display: none; }`}
          </style>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
               <p style={{ color: "#3D6BC0" }}>Fetching list...</p>
            </div>
          ) : visitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                🪑
              </div>
              <p className="font-body text-lg" style={{ color: "#3D6BC0", opacity: 0.5 }}>
                No visitors waiting right now
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex flex-col gap-3 py-4">
              {visitors.map((visitor, index) => (
                <VisitorCard
                  key={visitor.id}
                  visitor={visitor}
                  index={index}
                  isExiting={exitingId === visitor.id}
                  isConfirming={confirmId === visitor.id}
                  onExitClick={() => handleExitClick(visitor.id)}
                  onConfirmExit={() => handleConfirmExit(visitor)}
                  onCancelExit={() => setConfirmId(null)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showFeedback && exitedVisitor && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div className="relative z-10 w-full max-w-xl">
            <FeedBackFormPage
              visitorName={exitedVisitor.visitorName}
              onSubmit={(data) => {
                console.log("Feedback received:", data);
                setShowFeedback(false);
                setExitedVisitor(null);
                onBack();
              }}
            />
          </div>
        </div>
      )}
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
      <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center" style={{ border: "2px solid rgba(255,104,41,0.25)", background: "rgba(255,255,255,0.05)" }}>
        {visitor.photo ? (
          <img src={visitor.photo} alt="visitor" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold" style={{ color: "#FF6829" }}>
            {visitor.visitorName?.[0]?.toUpperCase()}
          </span>
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg" style={{ color: "#3D6BC0" }}>
          {visitor.visitorName}
        </h3>
        <div className="flex flex-wrap gap-4 text-xs mt-1">
          <InfoChip icon="🎯" text={visitor.purpose} />
          <InfoChip icon="👤" text={`Meeting: ${visitor.whomToMeet}`} />
          <InfoChip icon="🕐" text={`In: ${visitor.checkInTime}`} />
        </div>
      </div>

      {isConfirming ? (
        <div className="flex gap-2">
          <button onClick={onCancelExit} className="px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#3D6BC0" }}>
            Cancel
          </button>
          <button onClick={onConfirmExit} className="px-3 py-2 rounded-lg text-xs" style={{ background: "#FF6829", color: "white" }}>
            Confirm Exit
          </button>
        </div>
      ) : (
        <button onClick={onExitClick} className="px-5 py-2 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
          Exit
        </button>
      )}
    </div>
  );
}

function InfoChip({ icon, text }) {
  return (
    <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(61,107,192,0.6)" }}>
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  );
}