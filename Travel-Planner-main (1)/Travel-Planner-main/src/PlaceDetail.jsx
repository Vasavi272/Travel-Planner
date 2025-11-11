const [restaurants, setRestaurants] = useState([]);
const [hostels, setHostels] = useState([]);

useEffect(() => {
  (async () => {
    const rs = await getNearbyPlaces({ lat, lon, category: "catering.restaurant" });
    const hs = await getNearbyPlaces({ lat, lon, category: "accommodation.hostel" });
    setRestaurants(rs);
    setHostels(hs);
  })();
}, [lat, lon]);
