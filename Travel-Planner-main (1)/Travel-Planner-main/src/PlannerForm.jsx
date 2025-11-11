import { useEffect, useState } from "react";
import { allSpotNames } from "./data.js";

export default function PlannerForm({ value, onChange }) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  function update(field, v) {
    const next = { ...local, [field]: v };
    setLocal(next);
    onChange(next);
  }

  return (
    <>
      <div className="grid">
        <div>
          <label>Destination</label>
          <input
            placeholder="e.g., Paris, France"
            list="spots"
            value={local.destination}
            onChange={(e) => update("destination", e.target.value)}
          />
          <datalist id="spots">
            {allSpotNames.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </div>

        <div>
          <label>Start date</label>
          <input
            type="date"
            value={local.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
          <p className="mini">We’ll tailor best hours to your dates.</p>
        </div>

        <div>
          <label>Nights</label>
          <input
            type="number"
            min="1"
            value={local.nights}
            onChange={(e) => update("nights", Number(e.target.value || 0))}
          />
        </div>
      </div>
    </>
  );
}
