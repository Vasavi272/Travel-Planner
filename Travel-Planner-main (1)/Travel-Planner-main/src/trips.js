// src/trips.js
const KEY = "tripzy_trips";

/**
 * Load all saved trips (hotels + attractions)
 */
export function loadTrips() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Save full list back to storage
 */
export function saveTrips(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

/**
 * Add a saved item (hotel or attraction)
 * The object MUST at least include: id, type ("hotel" | "attraction"), name
 */
export function addTrip(item) {
  if (!item?.id || !item?.type) return;

  const trips = loadTrips();
  const exists = trips.some((t) => t.id === item.id && t.type === item.type);

  if (!exists) {
    trips.push(item);
    saveTrips(trips);
  }
}

/**
 * Remove by id+type (because hotel.id & attraction.id may overlap)
 */
export function removeTrip(id, type) {
  const trips = loadTrips().filter((t) => !(t.id === id && t.type === type));
  saveTrips(trips);
}

/**
 * Check if a specific item is already saved
 */
export function isSaved(id, type) {
  return loadTrips().some((t) => t.id === id && t.type === type);
}
