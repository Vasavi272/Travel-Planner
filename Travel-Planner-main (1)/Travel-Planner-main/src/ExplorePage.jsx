// src/ExplorePage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ExplorePage.css";

import { geocodeCity, getTrendingAttractions, getPlaceDetail } from "./api";
import { fetchHotels } from "./hotelsApi";
import { addTrip, removeTrip, isSaved } from "./trips";

/* --------------------------- Helpers --------------------------- */

const KIND_MAP = {
  All: "",
  Museums: "museums",
  Parks: "natural",
  Landmarks: "architecture",
  Religious: "religion",
  Food: "catering",
  Beaches: "beaches",
  Shopping: "shops",
};

function useQuery() {
  const params = new URLSearchParams(location.search);
  return {
    city:
      params.get("city") ||
      localStorage.getItem("last_destination") ||
      "Hyderabad",
    startDate: params.get("start") || "",
    guests: Number(params.get("guests") || 2),
    nights: Number(params.get("nights") || 3),
  };
}

function groupIntoDays(list, days) {
  const out = Array.from({ length: days }, () => []);
  list.forEach((item, i) => out[i % days].push(item));
  return out;
}

/* --------------------------- UI Bits --------------------------- */

function TopChips({ value, onChange }) {
  const labels = Object.keys(KIND_MAP);
  return (
    <div className="xp-chipbar">
      {labels.map((lbl) => (
        <button
          key={lbl}
          className={`xp-chip ${value === lbl ? "active" : ""}`}
          onClick={() => onChange(lbl)}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}

function RatingChips({ value, onChange }) {
  const levels = [0, 3, 4, 4.5];
  return (
    <div className="xp-chipbar small">
      <span className="xp-chiplabel">Hotels rating:</span>
      {levels.map((r) => (
        <button
          key={r}
          className={`xp-chip ${value === r ? "active" : ""}`}
          onClick={() => onChange(r)}
          title={r === 0 ? "Any rating" : `≥ ${r}`}
        >
          {r === 0 ? "Any" : `≥ ${r}`}
        </button>
      ))}
    </div>
  );
}

function Heart({ id, payload, onToggle }) {
  const saved = isSaved(id);
  return (
    <button
      className={`xp-heart ${saved ? "saved" : ""}`}
      aria-label={saved ? "Remove from Saved" : "Save"}
      onClick={(e) => {
        e.stopPropagation();
        saved ? removeTrip(id) : addTrip(payload);
        onToggle?.(); // force rerender
      }}
    >
      <span className="heart-shape" />
    </button>
  );
}

/* --------------------------- Explore Page --------------------------- */

export default function ExplorePage() {
  const navigate = useNavigate();
  const { city, startDate, guests, nights } = useQuery();

  // coords
  const [coords, setCoords] = useState({ lat: null, lon: null });

  // attractions
  const [kindChip, setKindChip] = useState("All");
  const [atLoading, setAtLoading] = useState(false);
  const [atErr, setAtErr] = useState("");
  const [attractions, setAttractions] = useState([]);

  // hotels
  const [hMinRating, setHMinRating] = useState(0);
  const [hLoading, setHLoading] = useState(false);
  const [hErr, setHErr] = useState("");
  const [hotels, setHotels] = useState([]);

  // flip state (click to flip)
  const [flipped, setFlipped] = useState(() => new Set());
  const toggleFlip = (id) =>
    setFlipped((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  // force re-render when saving/removing trips (for heart state)
  const [savedVersion, setSavedVersion] = useState(0);
  const bumpSaved = () => setSavedVersion((v) => v + 1);

  // itinerary modal
  const [showModal, setShowModal] = useState(false);
  const [daysPick, setDaysPick] = useState(3);

  const mountedRef = useRef(false);

  async function loadAll(_city = city) {
    try {
      // 1) coordinates
      const { lat, lon } = await geocodeCity(_city);
      setCoords({ lat, lon });

      // 2) attractions
      setAtLoading(true);
      setAtErr("");
      const feats = await getTrendingAttractions({
        lat,
        lon,
        radius: 10000,
        limit: 30,
      });

      // enrich with detail (parallel workers)
      const queue = [...(feats || [])];
      const result = [];
      async function worker() {
        while (queue.length) {
          const f = queue.shift();
          const xid = f?.properties?.xid;
          const name = f?.properties?.name || "Attraction";
          const coordinates = f?.geometry?.coordinates || [];
          const kinds = (f?.properties?.kinds || "")
            .split(",")
            .map((s) => s.trim());
          let image = "";
          let description = "";
          try {
            if (xid) {
              const d = await getPlaceDetail(xid);
              image = d?.preview?.source || "";
              description =
                d?.wikipedia_extracts?.text?.slice(0, 180) || d?.info || "";
            }
          } catch {}
          result.push({
            id: xid || `${name}-${coordinates[0]}-${coordinates[1]}`,
            xid,
            name,
            lon: coordinates[0],
            lat: coordinates[1],
            kinds,
            image,
            description,
            city: _city,
            type: "attraction",
          });
        }
      }
      await Promise.all([worker(), worker(), worker(), worker()]);
      setAttractions(result);

      // 3) hotels
      setHLoading(true);
      setHErr("");
      const hotelsRaw = await fetchHotels({ lat, lon, radius: 8000, limit: 24 });
      const hNorm = (hotelsRaw || []).map((h, i) => ({
        id: h.id ?? i,
        name: h.name ?? "Hotel",
        address: h.address || "",
        city: h.city || _city,
        rating: h.rating ?? null,
        lat: h.lat ?? null,
        lon: h.lon ?? null,
        website: h.website ?? null,
        image:
          h.image ||
          `https://picsum.photos/seed/h-${encodeURIComponent(String(h.id ?? i))}/1200/800`,
        type: "hotel",
        guests,
        nights,
        startDate,
      }));
      setHotels(hNorm);
    } catch (e) {
      const msg = e?.message || "Failed to load data";
      setAtErr(msg);
      setHErr(msg);
    } finally {
      setAtLoading(false);
      setHLoading(false);
    }
  }

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    loadAll(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAttractions = useMemo(() => {
    if (kindChip === "All") return attractions;
    const k = KIND_MAP[kindChip];
    // include if any kind contains the substring (robust)
    return attractions.filter((a) =>
      a.kinds?.some((t) => t.toLowerCase().includes(k))
    );
  }, [attractions, kindChip]);

  const filteredHotels = useMemo(() => {
    if (!hMinRating) return hotels;
    return hotels.filter((h) => (h.rating || 0) >= hMinRating);
  }, [hotels, hMinRating]);

  function openItinerary() {
    setDaysPick(Math.min(5, Math.max(2, nights || 3)));
    setShowModal(true);
  }

  function buildItinerary() {
    const days = Number(daysPick || 3);
    const picks = filteredAttractions.slice(
      0,
      Math.min(18, filteredAttractions.length)
    );
    const plan = groupIntoDays(picks, days);
    const payload = {
      city,
      days,
      guests,
      startDate,
      nights,
      createdAt: Date.now(),
      legs: plan.map((list, i) => ({
        day: i + 1,
        items: list.map((a) => ({
          id: a.id,
          name: a.name,
          lat: a.lat,
          lon: a.lon,
        })),
      })),
    };
    try {
      localStorage.setItem("tripzy_last_itinerary", JSON.stringify(payload));
    } catch {}
    setShowModal(false);
    alert(
      `Itinerary ready: ${days} day(s). Open the Tours page to view and edit it.`
    );
  }

  return (
    <div className="xp-shell">
      <header className="xp-hero">
        <div className="xp-hero-inner">
          <div>
            <h1 className="xp-title">Explore {city}</h1>
            <p className="xp-sub">
              Handpicked attractions & nearby stays. Guests: {guests} • Nights:{" "}
              {nights}
            </p>
          </div>

          <div className="xp-cta-wrap">
            <button className="xp-ghost" onClick={() => navigate("/home")}>
              ← Back
            </button>
            <button className="xp-primary" onClick={openItinerary}>
              Build Itinerary
            </button>
          </div>
        </div>

        <TopChips value={kindChip} onChange={setKindChip} />
        <RatingChips value={hMinRating} onChange={setHMinRating} />
      </header>

      <main className="xp-main container">
        {/* Attractions */}
        <section className="xp-section">
          <div className="xp-head">
            <h2>Top Attractions</h2>
            {atLoading ? <span className="muted small">Loading…</span> : null}
            {atErr ? <span className="error small">{atErr}</span> : null}
          </div>

          <div className="xp-grid">
            {atLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="xp-skeleton" />
              ))}

            {!atLoading &&
              filteredAttractions.map((a) => {
                const flippedNow = flipped.has(a.id);
                return (
                  <article
                    key={a.id}
                    className={`flipcard ${flippedNow ? "is-flipped" : ""}`}
                    onClick={() => toggleFlip(a.id)}
                  >
                    <div className="flip-inner" role="button" tabIndex={0}>
                      {/* Front */}
                      <div className="flip-face flip-front">
                        <img
                          src={
                            a.image ||
                            `https://picsum.photos/seed/attr-${encodeURIComponent(
                              a.id
                            )}/1200/800`
                          }
                          alt={a.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/attr-fb-${encodeURIComponent(
                              a.id
                            )}/1200/800`;
                          }}
                        />
                        <div className="flip-overlay">
                          <h3 className="flip-title">{a.name}</h3>
                          <p className="flip-sub muted small">{city}</p>
                        </div>
                        <Heart id={a.id} payload={a} onToggle={bumpSaved} />
                      </div>

                      {/* Back */}
                      <div className="flip-face flip-back" onClick={(e) => e.stopPropagation()}>
                        <div className="flip-back-body">
                          <h4 className="flip-back-title">{a.name}</h4>
                          <p className="flip-back-text">
                            {a.description ||
                              "Tap map for directions or save to Trips."}
                          </p>
                          <div className="flip-actions">
                            <a
                              className="xp-cta"
                              target="_blank"
                              rel="noreferrer"
                              href={`https://www.google.com/maps?q=${a.lat},${a.lon}`}
                            >
                              Open in Maps
                            </a>
                            <a
                              className="xp-ghost"
                              target="_blank"
                              rel="noreferrer"
                              href={
                                a.xid
                                  ? `https://opentripmap.com/en/card/${a.xid}`
                                  : `https://www.google.com/search?q=${encodeURIComponent(
                                      a.name + " " + city
                                    )}`
                              }
                            >
                              Learn more
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

            {!atLoading && !atErr && filteredAttractions.length === 0 && (
              <p className="muted">No attractions match the current filter.</p>
            )}
          </div>
        </section>

        {/* Hotels */}
        <section className="xp-section">
          <div className="xp-head">
            <h2>Nearby Hotels</h2>
            {hLoading ? <span className="muted small">Loading…</span> : null}
            {hErr ? <span className="error small">{hErr}</span> : null}
          </div>

          <div className="xp-grid">
            {hLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="xp-skeleton" />
              ))}

            {!hLoading &&
              filteredHotels.map((h) => {
                const flippedNow = flipped.has(`h-${h.id}`);
                return (
                  <article
                    key={h.id}
                    className={`flipcard ${flippedNow ? "is-flipped" : ""}`}
                    onClick={() => toggleFlip(`h-${h.id}`)}
                  >
                    <div className="flip-inner" role="button" tabIndex={0}>
                      {/* Front */}
                      <div className="flip-face flip-front">
                        <img
                          src={h.image}
                          alt={h.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/h-${encodeURIComponent(
                              String(h.id)
                            )}/1200/800`;
                          }}
                        />
                        {!!h.rating && (
                          <span className="xp-badge">★ {h.rating}</span>
                        )}
                        <div className="flip-overlay">
                          <h3 className="flip-title">{h.name}</h3>
                          <p className="flip-sub muted small">
                            {h.address || h.city}
                          </p>
                        </div>
                        <Heart id={h.id} payload={h} onToggle={bumpSaved} />
                      </div>

                      {/* Back */}
                      <div className="flip-face flip-back" onClick={(e) => e.stopPropagation()}>
                        <div className="flip-back-body">
                          <h4 className="flip-back-title">{h.name}</h4>
                          <div className="flip-actions">
                            <a
                              className="xp-cta"
                              target="_blank"
                              rel="noreferrer"
                              href={
                                h.website ||
                                `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
                                  `${h.name} ${h.city || ""}`
                                )}`
                              }
                            >
                              View details
                            </a>
                            <a
                              className="xp-ghost"
                              target="_blank"
                              rel="noreferrer"
                              href={
                                h.lat && h.lon
                                  ? `https://www.google.com/maps?q=${h.lat},${h.lon}`
                                  : `https://www.google.com/maps/search/${encodeURIComponent(
                                      `${h.name} ${h.city || ""}`
                                    )}`
                              }
                            >
                              Open map
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

            {!hLoading && !hErr && filteredHotels.length === 0 && (
              <p className="muted">No hotels meet the rating filter.</p>
            )}
          </div>
        </section>
      </main>

      {/* Itinerary modal */}
      {showModal && (
        <div className="xp-modal" onClick={() => setShowModal(false)}>
          <div className="xp-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Create Itinerary</h3>
            <p className="muted">
              Choose the number of days to auto-plan your sightseeing.
            </p>
            <div className="xp-days-pick">
              {[2, 3, 5].map((d) => (
                <button
                  key={d}
                  className={`xp-chip ${daysPick === d ? "active" : ""}`}
                  onClick={() => setDaysPick(d)}
                >
                  {d} days
                </button>
              ))}
            </div>
            <div className="xp-modal-actions">
              <button className="xp-ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="xp-primary" onClick={buildItinerary}>
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
