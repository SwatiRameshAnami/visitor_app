import { useEffect, useState } from "react";

export default function SuccessPopup({ visitorName, whomToMeet, onClose }) {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Animate in
    setTimeout(() => setVisible(true), 50);

    // Auto-close countdown
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300"
      style={{ background: visible ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0)" }}
    >
      <div
        className="relative flex flex-col items-center text-center gap-5 p-8 rounded-3xl max-w-md w-full mx-6 transition-all duration-350"
        style={{
          background: "linear-gradient(160deg, #0d1530, #111d42)",
          border: "1px solid rgba(240,192,96,0.3)",
          boxShadow: "0 0 60px rgba(240,192,96,0.15), 0 30px 60px rgba(0,0,0,0.5)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.92) translateY(20px)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 transition-all"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          ✕
        </button>

        {/* Animated success icon */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(240,192,96,0.2), rgba(240,192,96,0.05))",
            border: "2px solid rgba(240,192,96,0.4)",
            boxShadow: "0 0 30px rgba(240,192,96,0.2)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f0c060" strokeWidth="2" strokeLinecap="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18L6.6 2a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 5.41 5.41l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
          </svg>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <h2 className="gold-shimmer font-display text-3xl font-bold">
            Notification Sent!
          </h2>
          <p className="text-white/70 font-body text-base leading-relaxed">
            Hi <span className="text-gold-400 font-semibold">{visitorName}</span>, your arrival has been notified to{" "}
            <span className="text-gold-400 font-semibold">{whomToMeet}</span>.
          </p>
          <p className="text-white/50 font-body text-sm leading-relaxed">
            Please wait comfortably at the reception. Your host will be with you shortly.
          </p>
        </div>

        {/* Important note */}
        <div
          className="w-full px-4 py-3 rounded-xl flex items-start gap-3"
          style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <span className="text-lg mt-0.5">⚠️</span>
          <p className="text-amber-300/80 font-body text-sm leading-relaxed text-left">
            <span className="font-semibold">Important:</span> When you're leaving, please make sure to tap{" "}
            <span className="font-semibold">Exit</span> from the Waiting List so we can record your departure time.
          </p>
        </div>

        {/* Countdown ring */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="#f0c060"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - countdown / 10)}`}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-gold-400 font-body text-sm font-semibold">
              {countdown}
            </span>
          </div>
          <p className="text-white/30 font-body text-xs">Auto-closing in {countdown}s</p>
        </div>

        {/* OK button */}
        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-xl font-body text-sm font-semibold transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #e0a830, #f0c060)",
            color: "#0a0f1e",
            boxShadow: "0 4px 20px rgba(240,192,96,0.3)",
          }}
        >
          Got it, I'll wait here ✓
        </button>
      </div>
    </div>
  );
}
