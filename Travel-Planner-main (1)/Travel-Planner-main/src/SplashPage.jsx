import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function SplashPage() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 3000); // Start fade after 3s
    const timer2 = setTimeout(() => navigate("/home", { replace: true }), 4500); // Go to home after fade
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <img
  src="/splash.jpg"
  alt="Tripzy Background"
  className="splash-bg"
/>

      <div className="splash-overlay">
        <h1 className="splash-title">Welcome to <span>Tripzy</span></h1>
        <p className="splash-sub">No more rushed plans, no more missed spots.</p>
      </div>
    </div>
  );
}
