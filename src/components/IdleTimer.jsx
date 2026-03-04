import { useEffect, useRef } from "react";

export default function IdleTimer({ children, onIdle, timeout = 60000 }) {
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onIdle, timeout);
  };

  useEffect(() => {
    resetTimer();
    const events = ["mousedown", "mousemove", "keypress", "touchstart", "scroll", "click"];
    events.forEach((e) => document.addEventListener(e, resetTimer, { passive: true }));
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => document.removeEventListener(e, resetTimer));
    };
  }, []);

  return <>{children}</>;
}