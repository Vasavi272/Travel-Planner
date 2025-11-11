import { useRef, useState, useEffect } from "react";
import { SPOTS } from "./data.js";
import "./style.css";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router-dom";

function pickFrom(items, count = 4) {
  const src = (items?.length ? items : []).slice(0, count);
  return src.map((it, i) => {
    const name = it.name || it.title || `Attraction ${i + 1}`;
    const region = it.country || it.kind || "Region";
    const seed = encodeURIComponent(`${name}-${region}-${i}`);
    const img =
      it.image ||
      it.imageUrl ||
      `https://picsum.photos/seed/${seed}/1600/1100`;
    return { name, region, img };
  });
}

/* ---------- Signature Experience Section ---------- */
function SignatureExperiences({ items }) {
  const picks = pickFrom(items, 4);
  return (
    <section className="exp-wrap container">
      <div className="exp-head">
        <h2>Signature Experiences</h2>
        <p className="muted">Hand-picked moments to make your trip unforgettable.</p>
      </div>

      <div className="exp-grid">
        {picks.map((p, i) => (
          <article key={i} className={`exp-card ${i % 3 === 0 ? "tall" : ""}`}>
            <img src={p.img} alt={p.name} loading="lazy" />
            <div className="exp-overlay">
              <h3 className="exp-title">{p.name}</h3>
              <p className="exp-sub">{p.region}</p>
              <div className="exp-tags">
                <span>#culture</span><span>#food</span><span>#adventure</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- Traveler Stories ---------- */
function TravelerStories({ items }) {
  const picks = pickFrom(items, 6);
  const quotes = [
    "Best sunset of my life 🌅",
    "Hidden gems on day two!",
    "We ate like locals 😋",
    "Night market vibes ✨",
    "A perfect long weekend.",
    "Zero FOMO, all fun.",
  ];

  return (
    <section className="stories-wrap container">
      <div className="stories-head">
        <h2>Traveler Stories</h2>
        <p className="muted">Real moments from real trips—short & sweet.</p>
      </div>

      <div className="stories-rail">
        {picks.map((p, i) => (
          <article key={i} className="story-card">
            <img src={p.img} alt={p.name} loading="lazy" />
            <div className="story-body">
              <p className="story-quote">“{quotes[i % quotes.length]}”</p>
              <div className="story-meta">
                <span className="story-pin">📍</span>
                <span className="muted">{p.name}</span>
                <span className="story-dot">•</span>
                <span className="muted small">{p.region}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- Main Home Page ---------- */

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) setUser(saved);
  }, []);

  function requireLogin(callback) {
    if (!user) {
      alert("Please login to continue.");
      navigate("/login");
      return;
    }
    callback();
  }

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
    navigate("/login");
  };

  const [query, setQuery] = useState({
    from: "",
    destination: "",
    startDate: "",
    guests: 2,
    nights: 3,
  });

  function handleSearch() {
    requireLogin(() => {
      if (!query.destination) {
        alert("Enter a destination");
        return;
      }

      const params = new URLSearchParams(query).toString();
      navigate(`/explore?${params}`);
    });
  }

  return (
    <div className="home-bg">
      <header className="navbar glass">
        <div className="nav-inner">
          <div className="logo">Tripzy</div>

          <nav className="nav-links">
            <a onClick={() => navigate("/home")}>Home</a>
            <a onClick={() => navigate("/tours")}>Tours</a>
            <a onClick={() => navigate("/flights")}>Flights</a>
            <a onClick={() => navigate("/hotels")}>Hotels</a>
            <a onClick={() => navigate("/about")}>About</a>
            <a onClick={() => navigate("/contact")}>Contact</a>
          </nav>

          {!user ? (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          ) : (
            <div className="profile-menu">
              <button className="profile-btn">👤 {user} ▼</button>
              <div className="profile-dropdown">
                <span onClick={() => navigate("/home")}>🏠 Dashboard</span>
                <span onClick={logout}>🚪 Logout</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="hero-video-full">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="hero-center">
          <h3 className="hero-eyebrow">Plan easy, travel complete</h3>
          <h1 className="hero-heading">
            Make your dream travel <em>come true</em> with us
          </h1>
          <p className="hero-subtext">
            Tripzy will help you discover story-worthy travel moments together
          </p>

          <div
            className="hero-search"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          >
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

            <button className="hs-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <div className="scroll-cue">▼</div>
      </section>

      <main className="container">
        <section className="card tray-card-shell">
          <div className="tray-head">
            <h2>Trending Destinations</h2>
          </div>

          <div className="tray">
            {SPOTS.map((item, idx) => {
              const title = item.name;
              const region = item.country;
              const img = item.image;

              return (
                <article key={idx} className="tray-card">
                  <div className="tray-img-wrap">
                    <img src={img} alt={title} className="tray-img" />
                    <span className="tray-pill">🔥 trending</span>
                  </div>

                  <div className="tray-body">
                    <h3 className="tray-title">{title}</h3>
                    <div className="tray-loc">
                      <span className="pin">📍</span>
                      <span className="muted">{region}</span>
                    </div>
                    <button
                      className="trend-btn"
                      onClick={() =>
                        setQuery({ ...query, destination: `${title}, ${region}` })
                      }
                    >
                      Explore
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <SignatureExperiences items={SPOTS} />
      <TravelerStories items={SPOTS} />

      <Footer />
    </div>
  );
}
