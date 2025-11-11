// src/HotelsPage.jsx
import { useEffect, useMemo, useState } from "react";
import "./style.css";
import { resolveDestination, fetchHotels } from "./hotelsApi";
import { addTrip, removeTrip, isSaved } from "./trips";

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function HotelsPage() {
  const [city, setCity] = useState(
    localStorage.getItem("last_destination") ||
      new URLSearchParams(location.search).get("city") ||
      "Hyderabad"
  );

  const [checkin, setCheckin] = useState(todayPlus(7));
  const [checkout, setCheckout] = useState(todayPlus(10));
  const [adults, setAdults] = useState(2);

  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");

  const validDates = useMemo(
    () => new Date(checkin) < new Date(checkout),
    [checkin, checkout]
  );

  async function load() {
    if (!city || !validDates) return;

    setLoading(true);
    setError("");
    setHotels([]);

    try {
      const dest = await resolveDestination(city);
      const list = await fetchHotels({ lat: dest.lat, lon: dest.lon });

      const normalized = list.map((h, i) => ({
        id: h.id ?? i,
        name: h.name ?? "Hotel",
        city: dest.name ?? city,
        address: h.address ?? "",
        rating: h.rating ?? null,
        lat: h.lat ?? null,
        lon: h.lon ?? null,
        website: h.website ?? null,
        image: h.image ?? null,
        checkin,
        checkout,
        adults,
      }));

      setHotels(normalized.slice(0, 18));
    } catch (e) {
      setError(e.message || "Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  function toggleTrip(hotel) {
    if (isSaved(hotel.id)) {
      removeTrip(hotel.id);
    } else {
      addTrip(hotel);
    }
    setHotels([...hotels]); // 🔥 force UI re-render
  }

  return (
    <div className="page-shell">
      <header className="hotels-hero h1-hero">
        <div className="hotels-hero-inner h1-wrap">
          <div className="h1-head">
            <h1 className="h1-title">Find Hotels</h1>
            <p className="muted">Nearby hotels using Geoapify Places API.</p>
          </div>

          <div className="hotel-filters h1-filters">
            <input
              className="hf-input h1-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (e.g., Goa, Delhi, Chennai)"
            />
            <input
              className="hf-input h1-input"
              type="date"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
            />
            <input
              className="hf-input h1-input"
              type="date"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
            />
            <input
              className="hf-input h1-input"
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value || 1))}
            />
            <button
              className="hf-btn h1-btn"
              onClick={load}
              disabled={loading || !validDates}
            >
              {loading ? "Loading…" : "Search"}
            </button>
          </div>

          {!validDates && (
            <p className="error-text h1-error">Check-out must be after check-in.</p>
          )}
          {error && <p className="error-text h1-error">{error}</p>}
        </div>
      </header>

      <main className="container h1-container">
        <section className="h1-grid">
          {loading &&
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h1-card skeleton" />
            ))}

          {!loading && !error && hotels.length === 0 && (
            <p className="muted">No hotels found. Try a nearby city or different dates.</p>
          )}

          {!loading &&
            hotels.map((h) => {
              const saved = isSaved(h.id);
              const img =
                h.image ||
                `https://picsum.photos/seed/h-${encodeURIComponent(h.id)}/1200/800`;

              return (
                <article key={h.id} className="h1-card">
                  <div className="h1-img-wrap">
                    <img
                      src={img}
                      alt={h.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/fallback-${encodeURIComponent(
                          h.id
                        )}/1200/800`;
                      }}
                    />

                    <button
  className={`h1-heart ${saved ? "saved" : ""}`}
  onClick={() => {
    if (saved) {
      removeTrip(h.id);
    } else {
      addTrip(h);
    }
    setHotels([...hotels]);  // 🔥 force re-render
  }}
>
  {saved ? "❤️" : "🤍"}
</button>


                    {h.rating && (
                      <span className="h1-badge h1-badge-left">★ {h.rating}</span>
                    )}
                  </div>

                  <div className="h1-overlay">
                    <h3 className="h1-hotel">{h.name}</h3>
                    <p className="h1-sub muted small">{h.address}</p>
                  </div>
                </article>
              );
            })}
        </section>
      </main>
    </div>
  );
}
