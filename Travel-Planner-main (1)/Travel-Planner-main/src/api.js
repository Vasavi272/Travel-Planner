// src/api.js
import { OTM_KEY } from "./keys";

// City name -> lat/lon
export async function geocodeCity(city) {
  const r = await fetch(
    `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
      city
    )}&apikey=${OTM_KEY}`
  );
  const j = await r.json();
  if (!j?.lat || !j?.lon) throw new Error("City not found");
  return { lat: j.lat, lon: j.lon };
}

// Trending/nearby attractions by lat/lon
export async function getTrendingAttractions({ lat, lon, radius = 8000, limit = 12 }) {
  const r = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?lat=${lat}&lon=${lon}&radius=${radius}&rate=3&limit=${limit}&apikey=${OTM_KEY}`
  );
  const j = await r.json();
  return j.features ?? [];
}

// Place details (to fetch preview image + description)
export async function getPlaceDetail(xid) {
  const r = await fetch(
    `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${OTM_KEY}`
  );
  return await r.json();
}
