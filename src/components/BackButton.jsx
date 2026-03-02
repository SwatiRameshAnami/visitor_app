export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-5 left-6 z-30 w-10 h-10 rounded-full glass flex items-center justify-center transition-all duration-200 hover:bg-white/10 active:scale-95 group"
      style={{
        border: "1px solid rgba(255,104,41,0.3)",
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
      title="Go back"
    >
      <svg 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        className="transition-colors duration-200 group-hover:text-white"
        style={{ color: "rgba(255,104,41,0.3)" }}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}
