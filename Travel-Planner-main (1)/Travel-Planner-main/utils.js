export function monthFromISO(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.getMonth() + 1; // 1..12
}

export function humanRange(startISO, nights) {
  try {
    const start = new Date(startISO);
    const end = new Date(start);
    end.setDate(start.getDate() + (Number(nights) || 0));
    const fmt = (d) =>
      d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return `${fmt(start)} → ${fmt(end)}`;
  } catch {
    return "";
  }
}

export function seasonNote(spot, startISO) {
  const m = monthFromISO(startISO);
  if (!m) return "";
  const inBest = spot.seasons.best.includes(m);
  const inAvoid = spot.seasons.avoid.includes(m);
  if (inBest) return "Great month to visit ✨";
  if (inAvoid) return "Usually not ideal (crowds/weather). Consider alternate months.";
  return "Should be fine, but check local events/weather.";
}
