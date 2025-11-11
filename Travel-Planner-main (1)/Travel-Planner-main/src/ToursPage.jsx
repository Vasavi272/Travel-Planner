// src/ToursPage.jsx
import { useEffect, useState } from "react";
import "./style.css";
import { loadTrips, removeTrip } from "./trips";

export default function ToursPage() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    setTrips(loadTrips());
  }, []);

  function deleteTrip(id) {
    removeTrip(id);
    setTrips(loadTrips()); // refresh UI
  }

  return (
    <div className="page-shell">
      <header className="tours-hero">
        <h1>Your Saved Trips</h1>
        <p className="muted">All the hotels you marked as favourites.</p>
      </header>

      <main className="container t1-container">
        {trips.length === 0 && (
          <p className="muted center-text" style={{ marginTop: "40px" }}>
            You haven't saved any trips yet.  
            <br /> Go to <strong>Hotels</strong> and tap ❤️ to save one!
          </p>
        )}

        <section className="t1-grid">
          {trips.map((t) => {
            const img =
              t.image ||
              `https://picsum.photos/seed/trip-${encodeURIComponent(
                t.id
              )}/1200/800`;

            return (
              <article key={t.id} className="t1-card">
                <div className="t1-img-wrap">
                  <img src={img} alt={t.name} loading="lazy" />
                  {t.rating && (
                    <span className="t1-badge">★ {t.rating}</span>
                  )}

                  <button
                    className="t1-del"
                    onClick={() => deleteTrip(t.id)}
                    title="Remove trip"
                  >
                    🗑
                  </button>
                </div>

                <div className="t1-body">
                  <h3 className="t1-title">{t.name}</h3>
                  <p className="muted small">{t.address || t.city}</p>

                  <div className="t1-meta">
                    <span>📅 {t.checkin} → {t.checkout}</span>
                    <span>👥 {t.adults} adults</span>
                  </div>

                  <a
                    className="t1-cta"
                    href={`https://www.google.com/maps?q=${t.lat},${t.lon}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on map
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
