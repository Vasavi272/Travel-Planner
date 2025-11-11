import { SPOTS } from "./data.js";
import { seasonNote, humanRange } from "./utils.js";

function findSpotByUserInput(input) {
  if (!input) return null;
  const lower = input.toLowerCase();
  return (
    SPOTS.find(
      (s) =>
        lower.includes(s.name.toLowerCase()) ||
        lower.includes(s.country.toLowerCase())
    ) || null
  );
}

function Rating({ value }) {
  const pct = Math.max(0, Math.min(5, Number(value || 0))) / 5 * 100;
  return (
    <div className="rating" aria-label={`${value} out of 5`}>
      <span className="stars">
        <span className="fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="score">{Number(value).toFixed(1)}</span>
    </div>
  );
}

function CardGrid({ title, items, getKey, getTitle, getSubtitle, getImg, getRating }) {
  return (
    <div>
      <h3 style={{ marginTop: 6 }}>{title}</h3>
      <div className="card-grid">
        {items.map((item) => (
          <article key={getKey(item)} className="mini-card">
            <img className="img-cover" src={getImg(item)} alt={getTitle(item)} />
            <div className="mini-card-body">
              <div>
                <h4 className="mini-title">{getTitle(item)}</h4>
                {getSubtitle && <p className="muted small">{getSubtitle(item)}</p>}
              </div>
              {getRating && <Rating value={getRating(item)} />}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function Recommendations({ query }) {
  const spot = findSpotByUserInput(query.destination);

  if (!query.destination || !spot) {
    return (
      <section className="card">
        <h2>Recommendations</h2>
        <p className="muted">
          Enter a destination (or click a popular spot) to see hotels,
          restaurants, foods, and best visiting times.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <header className="header-row">
        <h2>
          {spot.emoji} {spot.name}, {spot.country}
        </h2>
        {query.startDate && query.nights ? (
          <span className="badge">{humanRange(query.startDate, query.nights)}</span>
        ) : null}
      </header>

      {query.startDate ? <p className="season">{seasonNote(spot, query.startDate)}</p> : null}

      <CardGrid
        title="🏨 Hotels"
        items={spot.hotels}
        getKey={(x) => x.name}
        getTitle={(x) => x.name}
        getImg={(x) => x.image}
        getRating={(x) => x.rating}
      />

      <CardGrid
        title="🍽️ Restaurants"
        items={spot.restaurants}
        getKey={(x) => x.name}
        getTitle={(x) => x.name}
        getImg={(x) => x.image}
        getRating={(x) => x.rating}
      />

      <CardGrid
        title="🍜 Popular Foods"
        items={spot.topFoods}
        getKey={(x) => x.name}
        getTitle={(x) => x.name}
        getImg={(x) => x.image}
        getRating={(x) => x.rating}
      />

      <CardGrid
        title="📍 Best Places (during your stay)"
        items={spot.highlights}
        getKey={(x) => x.place}
        getTitle={(x) => x.place}
        getSubtitle={(x) => x.bestHours}
        getImg={(x) => x.image}
      />

      <small className="muted">
        Images are representative. For live availability, events, and weather, check local listings.
      </small>
      <img
  className="img-cover"
  src={getImg(item)}
  alt={getTitle(item)}
  onError={(e) => { e.currentTarget.src = `https://picsum.photos/600/400?random=${encodeURIComponent(getKey(item))}`; }}
/>

    </section>
  );
}
