import { useNavigate } from "react-router-dom";
import "./style.css";

export default function AboutPage() {
  const navigate = useNavigate();

  const panels = [
    {
      key: "hero",
      title: "Travel, But Smarter.",
      sub: "Tripzy blends curation + AI to turn vague plans into unforgettable itineraries.",
      img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
      cta: { label: "Start Planning", to: "/home" },
    },
    {
      key: "mission",
      title: "Our Mission",
      sub: "Cut the overwhelm. Find the right spots, timings, and routes in minutes — not weeks.",
      img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop",
    },
    {
      key: "promise",
      title: "What We Promise",
      bullets: [
        "Human-quality curation with instant AI assistance",
        "Realistic routes, timings, and budget views",
        "Save & share plans with one link",
      ],
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2000&auto=format&fit=crop",
    },
    {
      key: "team",
      title: "A Tiny Team, Big Energy",
      sub: "Designers, engineers, and travelers building the tool we wished we had.",
      img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop",
    },
    {
      key: "cta",
      title: "Ready for Your Next Escape?",
      sub: "Pick a destination and we’ll do the rest.",
      img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2000&auto=format&fit=crop",
      cta: { label: "Build a Trip", to: "/home" },
    },
  ];

  return (
    <div className="about-wrap">
      {panels.map((p) => (
        <section
          key={p.key}
          className="about-panel"
          style={{ backgroundImage: `url(${p.img})` }}
          aria-label={p.title}
        >
          <div className="about-overlay" />
          <div className="about-inner">
            <h1 className="about-title">{p.title}</h1>

            {p.sub && <p className="about-sub">{p.sub}</p>}

            {p.bullets && (
              <ul className="about-list">
                {p.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}

            {p.cta && (
              <button
                className="about-cta"
                onClick={() => navigate(p.cta.to)}
              >
                {p.cta.label}
              </button>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

