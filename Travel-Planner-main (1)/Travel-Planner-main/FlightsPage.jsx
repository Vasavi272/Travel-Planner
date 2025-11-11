// src/FlightsPage.jsx
import { useEffect, useMemo, useState } from "react";
import "./style.css";
import {
  AIRPORTS,
  resolveAirport,
  generateMockFlights,
  generatePopularFor,
} from "./mockFlights";

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Glassmorphism + timeline cards
export default function FlightsPage() {
  const [from, setFrom] = useState(localStorage.getItem("last_from") || "Hyderabad");
  const [to, setTo] = useState(localStorage.getItem("last_to") || "Delhi");
  const [date, setDate] = useState(todayPlus(10));
  const [pax, setPax] = useState(1);

  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("price");

  const valid = useMemo(() => {
    const f = resolveAirport(from);
    const t = resolveAirport(to);
    return Boolean(f && t && date);
  }, [from, to, date]);

  function swap() {
    const a = from;
    setFrom(to);
    setTo(a);
  }

  function search() {
    setLoading(true);
    setError("");
    setFlights([]);

    // “offline search” via generator
    setTimeout(() => {
      try {
        const f = resolveAirport(from);
        const t = resolveAirport(to);

        if (!f || !t) {
          // fallback: mixed routes if user typed something odd
          const list = generatePopularFor(date);
          setFlights(list);
          setError("Showing popular mixed routes (couldn't resolve one of the airports).");
        } else {
          const list = generateMockFlights({
            fromCode: f.code,
            toCode: t.code,
            dateStr: date,
            count: 28,
          });
          setFlights(list);
          localStorage.setItem("last_from", from);
          localStorage.setItem("last_to", to);
        }
      } catch (e) {
        setError(e.message || "Could not build flight list");
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  useEffect(() => {
    // initial auto-load (popular)
    const list = generatePopularFor(date);
    setFlights(list);
  }, []); // eslint-disable-line

  const sorted = useMemo(() => {
    const arr = [...flights];
    if (sort === "price") arr.sort((a, b) => a.price - b.price);
    if (sort === "depart") arr.sort((a, b) => a.depart - b.depart);
    if (sort === "duration") arr.sort((a, b) => a.durationMin - b.durationMin);
    return arr;
  }, [flights, sort]);

  return (
    <div className="page-shell">
      {/* Glass Hero Filters */}
      <header className="fl-hero">
        <div className="fl-hero-inner">
          <h1 className="fl-title">Find Flights</h1>
          <p className="muted">Offline demo: realistic routes, no API required.</p>

          <div className="fl-filters glass">
            <div className="fl-field">
              <label>From</label>
              <input
                list="fl-airports"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="City or code (e.g., HYD)"
              />
            </div>
            <button className="fl-swap" onClick={swap} title="Swap">
              ⇄
            </button>
            <div className="fl-field">
              <label>To</label>
              <input
                list="fl-airports"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="City or code (e.g., DEL)"
              />
            </div>
            <div className="fl-field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="fl-field">
              <label>Passengers</label>
              <input
                type="number"
                min="1"
                value={pax}
                onChange={(e) => setPax(Number(e.target.value || 1))}
              />
            </div>
            <button className="fl-btn" onClick={search} disabled={loading || !date}>
              {loading ? "Searching…" : "Search"}
            </button>
          </div>

          {!valid && (
            <p className="error-text small">
              Tip: use well-known cities/codes (HYD, DEL, BLR, BOM, DXB, SIN, LHR, JFK…)
            </p>
          )}

          <div className="fl-toolbar">
            <span className="muted small">
              {sorted.length} flights • sort by{" "}
            </span>
            <select className="fl-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="price">Lowest price</option>
              <option value="depart">Earliest departure</option>
              <option value="duration">Shortest duration</option>
            </select>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="container fl-container">
        {error && <p className="error-text">{error}</p>}

        <section className="fl-grid">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <div key={i} className="fl-card skeleton" />)}

          {!loading && sorted.length === 0 && (
            <p className="muted">No flights for that search. Try other cities or a nearby date.</p>
          )}

          {!loading &&
            sorted.map((f) => (
              <article key={f.id} className="fl-card glass">
                <div className="fl-card-head">
                  <div className="fl-airline">
                    <div className="fl-logo">{f.airline.split(" ").map(w => w[0]).slice(0,2).join("")}</div>
                    <div>
                      <h3 className="fl-aname">{f.airline}</h3>
                      <p className="muted tiny">{f.flightNo}</p>
                    </div>
                  </div>
                  <div className="fl-price">
                    <div className="fl-amt">
                      {f.currency} {f.price.toLocaleString("en-IN")}
                    </div>
                    <div className="muted tiny">{f.stops === 0 ? "Nonstop" : `${f.stops} stop${f.stops>1?"s":""}`}</div>
                  </div>
                </div>

                <div className="fl-timeline">
                  <div className="fl-leg">
                    <div className="fl-time">
                      {pad2(f.depart.getHours())}:{pad2(f.depart.getMinutes())}
                    </div>
                    <div className="fl-code">{f.from}</div>
                  </div>

                  <div className="fl-line">
                    <span className="fl-dot" />
                    <span className="fl-dur">{f.durationText}</span>
                    <span className="fl-dot" />
                  </div>

                  <div className="fl-leg">
                    <div className="fl-time">
                      {pad2(f.arrive.getHours())}:{pad2(f.arrive.getMinutes())}
                    </div>
                    <div className="fl-code">{f.to}</div>
                  </div>
                </div>

                <div className="fl-actions">
                  <a
                    className="fl-ghost"
                    href={`https://www.google.com/travel/flights?q=${encodeURIComponent(
                      `${f.from} to ${f.to} on ${f.depart.toISOString().slice(0,10)}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View on Google Flights
                  </a>
                  <button className="fl-cta">Select</button>
                </div>
              </article>
            ))}
        </section>
      </main>

      <datalist id="fl-airports">
        {AIRPORTS.map((a) => (
          <option key={a.code} value={a.city} label={a.code} />
        ))}
        {AIRPORTS.map((a) => (
          <option key={a.code + "-c"} value={a.code} label={a.city} />
        ))}
      </datalist>
    </div>
  );
}

function pad2(n) {
  return String(n).padStart(2, "0");
}
