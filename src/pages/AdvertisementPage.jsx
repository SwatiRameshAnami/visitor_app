import { useEffect, useState } from "react";

const slides = [
  {
    headline: "Welcome to",
    title: "WizzyBox",
    subtitle: "Innovating Tomorrow, Today",
    description: "Transforming businesses through cutting-edge technology and visionary solutions since 2010.",
    icon: "🏢",
    // Pexels free nature video (aerial forest)
    videoUrl: "https://videos.pexels.com/video-files/857251/857251-hd_1920_1080_25fps.mp4",
  },
  {
    headline: "Our Mission",
    title: "Empowering Growth",
    subtitle: "Client-First. Always.",
    description: "We partner with forward-thinking companies to build scalable, impactful digital ecosystems.",
    icon: "🚀",
    // Pexels free nature video (ocean waves)
    videoUrl: "https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_25fps.mp4",
  },
  {
    headline: "Our Vision",
    title: "A Connected World",
    subtitle: "Where Innovation Meets Humanity",
    description: "Leading the way in enterprise solutions that bring people, processes, and technology together.",
    icon: "🌐",
    // Pexels free nature video (waterfall)
    videoUrl: "https://videos.pexels.com/video-files/1194720/1194720-hd_1920_1080_25fps.mp4",
  },
  {
    headline: "Excellence In",
    title: "Every Endeavour",
    subtitle: "ISO 9001:2015 Certified",
    description: "Trusted by 500+ clients across 20+ countries. Quality is not just a promise — it's our culture.",
    icon: "⭐",
    // Pexels free nature video (mountains)
    videoUrl: "https://videos.pexels.com/video-files/1448735/1448735-hd_1920_1080_25fps.mp4",
  },
];

export default function AdvertisementPage({ onTouch }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [tapRipple, setTapRipple] = useState(null);

  useEffect(() => {
    // Each video is 6 seconds; auto-advance every 6s
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleTouch = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX || e.clientX) - rect.left;
    const y = (e.touches?.[0]?.clientY || e.clientY) - rect.top;
    setTapRipple({ x, y, id: Date.now() });
    setTimeout(() => setTapRipple(null), 600);
    setTimeout(onTouch, 200);
  };

  const slide = slides[activeSlide];

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      onClick={handleTouch}
      onTouchStart={handleTouch}
    >
      {/* Background video — sits at the very bottom, subtle behind blobs */}
      {slides.map((s, i) => (
        <video
          key={i}
          src={s.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: i === activeSlide ? 0.18 : 0, zIndex: 0 }}
        />
      ))}

      {/* Animated background blobs */}
      <div className="blob w-96 h-96 bg-blue-700" style={{ top: "-10%", left: "-5%", animationDelay: "0s", zIndex: 2 }} />
      <div className="blob w-80 h-80" style={{ bottom: "5%", right: "0%", animationDelay: "3s", background: "#FF6829", zIndex: 2 }} />
      <div className="blob w-64 h-64 bg-indigo-800" style={{ top: "50%", left: "60%", animationDelay: "1.5s", zIndex: 2 }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,104,41,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,104,41,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 3,
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 opacity-40 rounded-br-3xl" style={{ borderColor: "#FF6829", zIndex: 4 }} />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 opacity-40 rounded-tl-3xl" style={{ borderColor: "#FF6829", zIndex: 4 }} />

      {/* Logo / company icon */}
      <div className="relative mb-8 flex flex-col items-center" style={{ zIndex: 5 }}>
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center text-5xl mb-4 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,104,41,0.2), rgba(255,104,41,0.05))",
            border: "1px solid rgba(255,104,41,0.35)",
          }}
        >
          {slide.icon}
        </div>
      </div>

      {/* Slide content */}
      <div
        className="relative text-center px-16 max-w-3xl"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? "translateY(12px)" : "translateY(0)",
          transition: "all 0.4s ease",
          zIndex: 5,
        }}
      >
        <p className="font-body font-medium text-lg tracking-[0.25em] uppercase mb-2" style={{ color: "#FF6829" }}>
          {slide.headline}
        </p>
        <h1
          className="font-display text-6xl font-bold leading-tight mb-3"
          style={{ color: "#3D6BC0" }}
        >
          {slide.title}
        </h1>
        <p className="font-body text-2xl font-light italic mb-5" style={{ color: "#3D6BC0", opacity: 0.8 }}>
          {slide.subtitle}
        </p>
        <p className="font-body text-base leading-relaxed max-w-xl mx-auto" style={{ color: "#3D6BC0", opacity: 0.65 }}>
          {slide.description}
        </p>
      </div>

      {/* Slide indicators */}
      <div className="relative flex gap-2 mt-10" style={{ zIndex: 5 }}>
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-500"
            style={{
              width: i === activeSlide ? "32px" : "8px",
              background: i === activeSlide ? "#FF6829" : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Tap to begin */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "pulseSoft 2.5s ease-in-out infinite", zIndex: 5 }}
      >
        <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: "#FF6829" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 3.5C9 2.12 10.12 1 11.5 1C12.88 1 14 2.12 14 3.5V12.5C14 13.88 12.88 15 11.5 15C10.12 15 9 13.88 9 12.5V3.5Z" fill="#FF6829" />
            <path d="M6 9.5C6 8.12 7.12 7 8.5 7V12.5C8.5 14.43 9.57 16.1 11.15 17H5.5C4.12 17 3 15.88 3 14.5C3 13.12 4.12 12 5.5 12V9.5C5.5 8.67 5.67 8 6 9.5Z" fill="#FF6829" opacity="0.5"/>
            <path d="M5.5 12C4.12 12 3 13.12 3 14.5C3 15.88 4.12 17 5.5 17C5.84 17 6 16.84 6 16.5V12.5C6 12.5 5.77 12 5.5 12Z" fill="#FF6829"/>
          </svg>
        </div>
        <span className="font-body text-xs tracking-widest uppercase" style={{ color: "rgba(255,104,41,0.7)" }}>
          Touch to Begin
        </span>
      </div>

      {/* Ripple effect */}
      {tapRipple && (
        <div
          key={tapRipple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: tapRipple.x - 50,
            top: tapRipple.y - 50,
            width: 100,
            height: 100,
            border: "2px solid rgba(255,104,41,0.8)",
            animation: "rippleOut 0.6s ease-out forwards",
            zIndex: 20,
          }}
        />
      )}

      <style>{`
        @keyframes rippleOut {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}