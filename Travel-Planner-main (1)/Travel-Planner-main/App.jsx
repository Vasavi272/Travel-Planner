import { useState } from "react";
import PlannerForm from "./PlannerForm.jsx";
import Recommendations from "./Recommendations.jsx";
import { SPOTS } from "./data.js";

export default function App() {
  const [query, setQuery] = useState({
    destination: "",
    startDate: "",
    nights: 3,
  });

  return (
    <main className="container">
      <header className="hero">
        <h1>🌍 Travel Planner</h1>
        <p className="muted">
          Discover trending destinations and instantly get hotels, restaurants,
          foods, and best visiting times for your stay.
        </p>
      </header>
      <img
  className="img-cover"
  src={s.image}
  alt={`${s.name} cover`}
  onError={(e) => { e.currentTarget.src = `https://picsum.photos/800/600?random=${encodeURIComponent(s.id)}`; }}
/>

      <section className="card">
        <h2>Trending vacation spots</h2>
        <div className="cards">
          {SPOTS.map((s) => (
            <article key={s.id} className="spot-card image-card">
              <img className="img-cover" src={s.image} alt={`${s.name} cover`} />
              <div className="image-card-body">
                <div className="spot-head">
                  <span className="spot-emoji">{s.emoji}</span>
                  <div>
                    <h3 className="spot-title">{s.name}</h3>
                    <p className="muted">{s.country}</p>
                  </div>
                </div>
                <button
                  className="primary"
                  onClick={() =>
                    setQuery((q) => ({ ...q, destination: `${s.name}, ${s.country}` }))
                  }
                >
                  Pick
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <PlannerForm value={query} onChange={setQuery} />
      <Recommendations query={query} />
    </main>
  );
}
