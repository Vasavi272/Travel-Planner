import { useState } from "react";

export default function DestinationForm({ onAdd }) {
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!place || !date) return;
    onAdd(place, date);
    setPlace("");
    setDate("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter destination"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
