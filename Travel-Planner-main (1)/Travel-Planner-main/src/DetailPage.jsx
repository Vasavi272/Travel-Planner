import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SPOTS } from "./data.js";
import "./style.css";

/* API helpers (from src/api.js) */
import {
  geocodeCity,
  getTrendingAttractions,
  getPlaceDetail,
} from "./api";

export default function HomePage() {
  const [query, setQuery] = useState({
    from: "",
    destination: "",
    startDate: "",
    guests: 2,
    nights: 3,
  });

  const [trending, setTrending] = useState([]);          // API-backed cards
  const [loadingTrend, setLoadingTrend] = useState(false);
  const [errorTrend, setErrorTrend] = useState("");

  const navigate = useNavigate();

  async function loadTrending() {
    if (!query.destination) return;
    setLoadingTrend(true);
    setErrorTrend("");

    try {
      // 1) city -> lat/lon
      const { lat, lon } = await geocodeCity(query.destination);

      // 2) attractions around city
      const feats = await getTrendingAttractions({ lat, lon });

      // 3) fetch detail for preview image + richer text
      const enriched = await Promise.all(
        (feats || []).map(async (f) => {
          const xid = f?.properties?.xid;
          const name = f?.properties?.name || "Attraction";
          const coords = f?.geometry?.coordinates || [];
          let image = "";
          let description = "";
          if (xid) {
            try {
              const detail = await getPlaceDetail(xid);
              image = detail?.preview?.source || "";
              description =
                detail?.wikipedia_extracts?.text ||
                detail?.info ||
                "";
            } catch {
              /* ignore per-item failures */
            }
          }
          return {
            xid,
            name,
            lon: coords[0],
            lat: coords[1],
            image,
            description,
            kind: (f?.properties?.kinds || "").split(",")[0] || "Attraction",
          };
        })
      );

      setTrending(enriched);
      // Optional: smooth scroll to the section
      setTimeout(() => {
        const el = document.getElementById("trending-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    } catch (e) {
      console.error(e);
      setErrorTrend("Could not load trending places for that destination.");
      setTrending([]);
    } finally {
      setLoadingTrend(false);
    }
  }

  return (
    <div className="home-bg">
      {/* 🧭 Header (logo left, links center, login right) */}
      <header className="navbar glass">
        <div className="nav-inner">
          <div className="logo">Tripzy</div>
          <nav className="nav-links">
            <a href="#">Home</a>
            <a href="#">Tours</a>
            <a href="#">Flights</a>
            <a href="#">Hotels</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>
          <button className="login-btn">Login</button>
        </div>
      </header>

      {/* 🌅 Fullscreen HERO with video background */}
      <section className="hero-video-full">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-beach.jpg" /* optional fallback image */
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Centered overlay text */}
        <div className="hero-center">
          <h3 className="hero-eyebrow">Plan easy, travel complete</h3>
          <h1 className="hero-heading">
            Make your dream travel <em>come true</em> with us
          </h1>
          <p className="hero-subtext">
            Tripzy will help you discover story-worthy travel moments together
          </p>

          {/* Plan Your Trip – compact search bar */}
          <div className="hero-search">
            <div className="hs-field">
              <span className="hs-label">From</span>
              <input
                placeholder="City or airport"
                value={query.from}
                onChange={(e) => setQuery({ ...query, from: e.target.value })}
              />
            </div>

            <div className="hs-field">
              <span className="hs-label">To</span>
              <input
                list="spots"
                placeholder="Where to?"
                value={query.destination}
                onChange={(e) =>
                  setQuery({ ...query, destination: e.target.value })
                }
              />
              <datalist id="spots">
                {SPOTS.map((s) => (
                  <option key={s.id} value={`${s.name}, ${s.country}`} />
                ))}
              </datalist>
            </div>

            <div className="hs-field">
              <span className="hs-label">Date of stay</span>
              <input
                type="date"
                value={query.startDate}
                onChange={(e) =>
                  setQuery({ ...query, startDate: e.target.value })
                }
              />
            </div>

            <div className="hs-field">
              <span className="hs-label">Guests</span>
              <input
                type="number"
                min="1"
                value={query.guests}
                onChange={(e) =>
                  setQuery({ ...query, guests: Number(e.target.value || 1) })
                }
              />
            </div>

            {/* Trigger API search instead of local SPOTS nav */}
            <button className="hs-btn" onClick={loadTrending}>
              Search
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-cue">▼</div>
      </section>

      {/* Below the fold */}
      <main className="container">
        {/* Trending Destinations (API-backed, with SPOTS fallback) */}
        <section id="trending-section" className="card">
          <h2>Trending Destinations</h2>

          {loadingTrend && <p>Loading…</p>}
          {errorTrend && <p className="muted">{errorTrend}</p>}

          <div className="cards">
            {(trending.length > 0 ? trending : SPOTS).map((item, idx) => {
              // Normalize fields for API vs local SPOTS
              const key = item.xid || item.id || idx;
              const title = item.name || item.title || item?.name;
              const country = item.country || item?.country || "";
              const img =
                item.image ||
                item.imageUrl ||
                item.image ||
                "https://picsum.photos/600/400?travel";

              return (
                <article
                  key={key}
                  className="spot-card image-card"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setQuery((q) => ({
                      ...q,
                      destination: country ? `${title}, ${country}` : title,
                    }))
                  }
                >
                  <img className="img-cover" src={img} alt={`${title} cover`} />
                  <div className="image-card-body">
                    <div className="spot-head">
                      {/* keep emoji only for SPOTS items if present */}
                      {item.emoji && (
                        <span className="spot-emoji">{item.emoji}</span>
                      )}
                      <div>
                        <h3 className="spot-title">{title}</h3>
                        <p className="muted">
                          {country || item.kind || "Attraction"}
                        </p>
                      </div>
                    </div>
                    <button
                      className="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuery((q) => ({
                          ...q,
                          destination: country
                            ? `${title}, ${country}`
                            : title,
                        }));
                        // Optionally re-run search immediately
                        loadTrending();
                      }}
                    >
                      Pick
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
