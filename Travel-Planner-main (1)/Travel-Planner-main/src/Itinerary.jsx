export default function Itinerary({ list }) {
  if (list.length === 0) {
    return <p className="empty">No destinations added yet ✈️</p>;
  }

  return (
    <ul className="itinerary">
      {list.map((item, index) => (
        <li key={index}>
          <strong>{item.place}</strong> on {item.date}
        </li>
      ))}
    </ul>
  );
}
