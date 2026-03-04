export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-5 left-6 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
      style={{
        backgroundColor: "#FF6829",
        boxShadow: "0 4px 14px rgba(255,104,41,0.35)",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
      title="Go back"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0a0f1e"
        strokeWidth="2.5"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}