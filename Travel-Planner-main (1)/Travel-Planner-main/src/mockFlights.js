// src/mockFlights.js

// Minimal airline + route catalog for realistic-looking offline results
export const AIRLINES = [
  { code: "6E", name: "IndiGo" },
  { code: "AI", name: "Air India" },
  { code: "UK", name: "Vistara" },
  { code: "SG", name: "SpiceJet" },
  { code: "G8", name: "Go First" },
  { code: "EK", name: "Emirates" },
  { code: "QR", name: "Qatar Airways" },
  { code: "SQ", name: "Singapore Airlines" },
  { code: "BA", name: "British Airways" },
];

export const AIRPORTS = [
  { city: "Hyderabad", code: "HYD" },
  { city: "Delhi", code: "DEL" },
  { city: "Mumbai", code: "BOM" },
  { city: "Bengaluru", code: "BLR" },
  { city: "Chennai", code: "MAA" },
  { city: "Goa", code: "GOI" },
  { city: "Kolkata", code: "CCU" },
  { city: "Dubai", code: "DXB" },
  { city: "Doha", code: "DOH" },
  { city: "Singapore", code: "SIN" },
  { city: "London", code: "LHR" },
  { city: "New York", code: "JFK" },
  { city: "Sydney", code: "SYD" },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pad2 = (n) => String(n).padStart(2, "0");

// Build a local catalog of popular mixed routes
const POPULAR_ROUTES = [
  ["HYD", "DEL"], ["BLR", "BOM"], ["GOI", "MAA"], ["DEL", "BLR"], // domestic
  ["HYD", "DXB"], ["DEL", "DOH"], ["BOM", "SIN"],                  // short intl
  ["BLR", "LHR"], ["DEL", "JFK"], ["BOM", "SYD"],                  // long intl
];

// Convert city or code → {city, code}
export function resolveAirport(input) {
  if (!input) return null;
  const txt = String(input).trim().toLowerCase();
  return (
    AIRPORTS.find(
      (a) => a.code.toLowerCase() === txt || a.city.toLowerCase() === txt
    ) || null
  );
}

// Make a date at HH:MM local (just formatting; no tz math)
function atTime(dateStr, hour, minute) {
  const d = new Date(dateStr);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// Duration in minutes → "Xh Ym"
function fmtDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function priceForRoute(from, to) {
  const domestic = ["IN", "IN"]; // fake marker, not used; keeping simple
  const isIntl =
    ["DXB", "DOH", "SIN", "LHR", "JFK", "SYD"].includes(from) ||
    ["DXB", "DOH", "SIN", "LHR", "JFK", "SYD"].includes(to);

  if (!isIntl) return 3500 + Math.floor(Math.random() * 4500); // ₹
  // Intl tiered by distance-ish
  const longHaul = ["LHR", "JFK", "SYD"].some((c) => from === c || to === c);
  return longHaul
    ? 38000 + Math.floor(Math.random() * 22000)
    : 18000 + Math.floor(Math.random() * 12000);
}

// Generate mock flights for a day
export function generateMockFlights({ fromCode, toCode, dateStr, count = 24 }) {
  const flights = [];
  for (let i = 0; i < count; i++) {
    const al = pick(AIRLINES);
    const stops = Math.random() < 0.75 ? 0 : Math.random() < 0.5 ? 1 : 2; // mostly nonstop
    const depH = 5 + Math.floor(Math.random() * 17); // 05:00–22:00
    const depM = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const dep = atTime(dateStr, depH, depM);

    // crude duration buckets by route type
    let durationMin = 90 + Math.floor(Math.random() * 120); // base 1.5–3.5h
    if (["DXB", "DOH", "SIN"].includes(toCode) || ["DXB", "DOH", "SIN"].includes(fromCode)) {
      durationMin = 240 + Math.floor(Math.random() * 120); // 4–6h
    }
    if (["LHR", "JFK", "SYD"].includes(toCode) || ["LHR", "JFK", "SYD"].includes(fromCode)) {
      durationMin = 540 + Math.floor(Math.random() * 240); // 9–13h
    }
    durationMin += stops * (50 + Math.floor(Math.random() * 40));

    const arr = new Date(dep.getTime() + durationMin * 60000);

    const price = priceForRoute(fromCode, toCode);
    flights.push({
      id: `${al.code}-${fromCode}${toCode}-${i}-${dep.getTime()}`,
      airline: al.name,
      flightNo: `${al.code} ${Math.floor(100 + Math.random() * 900)}`,
      from: fromCode,
      to: toCode,
      depart: dep,
      arrive: arr,
      durationMin,
      durationText: fmtDuration(durationMin),
      stops,
      price,
      currency: "₹",
    });
  }
  // Sort cheapest first by default
  flights.sort((a, b) => a.price - b.price);
  return flights;
}

// If user didn’t enter from/to, give a mixed bag of popular routes
export function generatePopularFor(dateStr) {
  const all = [];
  POPULAR_ROUTES.forEach(([f, t]) => {
    all.push(...generateMockFlights({ fromCode: f, toCode: t, dateStr, count: 4 }));
  });
  return all;
}
