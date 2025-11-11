// src/hotelsApi.js
const GEOAPIFY_KEY = "05d17806f3e34c57ab28c7a41c06ba4e";

/* 1. Convert city -> lat/lon */
export async function resolveDestination(city) {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    city
  )}&apiKey=${GEOAPIFY_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data?.features?.length) {
    throw new Error("City not found — try a bigger city or different spelling");
  }

  const props = data.features[0].properties;
  return {
    lat: props.lat,
    lon: props.lon,
    name: props.formatted || city,
  };
}

/* 2. Fetch nearby hotels using Geoapify Places API */
export async function fetchHotels({ lat, lon, radius = 5000, limit = 20 }) {
  const url = `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},${radius}&limit=${limit}&apiKey=${GEOAPIFY_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return (data.features || []).map((f, i) => {
    const p = f.properties;
    return {
      id: p.place_id || i,
      name: p.name || "Hotel",
      address: p.address_line2 || "",
      rating: p.rating || null,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
      website: p.website || null,
      // No real hotel images from Geoapify → we use fallback in UI
      image: null,
    };
  });
}
