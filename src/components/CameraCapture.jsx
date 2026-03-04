import { useEffect, useRef, useState } from "react";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const startCountdown = () => {
    setCountdown(3);
    const tick = (n) => {
      if (n === 0) {
        capturePhoto();
        setCountdown(null);
      } else {
        setCountdown(n);
        setTimeout(() => tick(n - 1), 1000);
      }
    };
    setTimeout(() => tick(2), 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0);
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      stopCamera();
      onCapture(dataUrl);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div
        className="relative flex flex-col items-center gap-5 p-6 rounded-3xl w-full max-w-sm"
        style={{ background: "#ffffff", border: "1px solid rgba(255,104,41,0.25)" }}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold" style={{ color: "#FF6829" }}>Take Your Photo</h3>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: "rgba(61,107,192,0.08)", color: "#3D6BC0" }}
          >
            ✕
          </button>
        </div>

        {/* Camera preview */}
        <div className="relative w-64 h-64 rounded-2xl overflow-hidden" style={{ border: "2px solid rgba(255,104,41,0.35)" }}>
          {error ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/5 px-4 text-center">
              <span className="text-4xl">📷</span>
              <p className="font-body text-sm" style={{ color: "#3D6BC0", opacity: 0.8 }}>{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                  <span className="font-display text-8xl font-bold" style={{ color: "#FF6829" }}>{countdown}</span>
                </div>
              )}
              {/* Flash */}
              {flash && <div className="absolute inset-0 bg-white" style={{ animation: "flashOut 0.3s ease forwards" }} />}
              {/* Guide frame */}
              {!countdown && ready && (
                <>
                  <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg opacity-70" style={{ borderColor: "#FF6829" }} />
                  <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-70" style={{ borderColor: "#FF6829" }} />
                  <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-70" style={{ borderColor: "#FF6829" }} />
                  <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 rounded-br-lg opacity-70" style={{ borderColor: "#FF6829" }} />
                </>
              )}
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {/* Tips */}
        <p className="font-body text-xs text-center" style={{ color: "#3D6BC0", opacity: 0.7 }}>
          Position your face within the frame and ensure good lighting
        </p>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="flex-1 py-3 rounded-xl font-body text-sm font-medium transition-all active:scale-95"
            style={{ background: "#f0f4ff", border: "1px solid rgba(61,107,192,0.25)", color: "#3D6BC0" }}
          >
            Cancel
          </button>
          {!error && (
            <button
              onClick={startCountdown}
              disabled={!ready || countdown !== null}
              className="flex-1 py-3 rounded-xl font-body text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #e05520, #FF6829)",
                color: "#ffffff",
                boxShadow: "0 4px 16px rgba(255,104,41,0.3)",
              }}
            >
              {countdown !== null ? `Taking in ${countdown}...` : ready ? "📸 Capture" : "Starting..."}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes flashOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}