const img = (q) => `https://source.unsplash.com/800x600/?${encodeURIComponent(q)}`;

export const SPOTS = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    emoji: "🗼",
    image: img("paris eiffel tower skyline"),
    topFoods: [
      { name: "Croissant", image: img("croissant"), rating: 4.7, price: "$" },
      { name: "Crème brûlée", image: img("creme brulee dessert"), rating: 4.6, price: "$$" },
      { name: "Baguette", image: img("baguette bread"), rating: 4.5, price: "$" },
      { name: "Macarons", image: img("macarons"), rating: 4.6, price: "$$" }
    ],
    hotels: [
      { name: "Hôtel Lutetia", image: img("hotel paris luxury"), rating: 4.7, price: "$$$$" },
      { name: "Le Meurice", image: img("hotel paris 5 star"), rating: 4.8, price: "$$$$" },
      { name: "Hotel Le Six", image: img("boutique hotel paris"), rating: 4.5, price: "$$$" },
      { name: "CitizenM Paris", image: img("hotel modern lobby"), rating: 4.4, price: "$$" }
    ],
    restaurants: [
      { name: "Le Comptoir", image: img("paris bistro"), rating: 4.6, price: "$$$" },
      { name: "Septime", image: img("fine dining plate"), rating: 4.7, price: "$$$$" },
      { name: "L'As du Fallafel", image: img("falafel wrap"), rating: 4.5, price: "$" },
      { name: "Le Relais de l'Entrecôte", image: img("steak frites"), rating: 4.6, price: "$$" }
    ],
    seasons: { best: [4, 5, 6, 9], avoid: [7, 8] },
    highlights: [
      { place: "Eiffel Tower", bestHours: "Sunset & evening", image: img("eiffel sunset") },
      { place: "Louvre Museum", bestHours: "Early morning (9–11am)", image: img("louvre museum") }
    ]
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    emoji: "🏝️",
    image: img("bali beach cliff"),
    topFoods: [
      { name: "Nasi Goreng", image: img("nasi goreng"), rating: 4.6, price: "$" },
      { name: "Satay", image: img("satay skewers"), rating: 4.5, price: "$" },
      { name: "Babi Guling", image: img("babi guling"), rating: 4.4, price: "$$" }
    ],
    hotels: [
      { name: "Alila Uluwatu", image: img("bali resort infinity pool"), rating: 4.8, price: "$$$$" },
      { name: "The Chedi Club", image: img("bali luxury villa"), rating: 4.7, price: "$$$$" },
      { name: "Grand Hyatt Bali", image: img("bali resort"), rating: 4.6, price: "$$$$" },
      { name: "Munduk Moding", image: img("bali mountain resort"), rating: 4.6, price: "$$$" }
    ],
    restaurants: [
      { name: "Locavore", image: img("tasting menu fine dining"), rating: 4.7, price: "$$$$" },
      { name: "Warung Babi Guling Pak Malen", image: img("warung bali"), rating: 4.4, price: "$" },
      { name: "Betelnut Cafe", image: img("smoothie bowl cafe"), rating: 4.5, price: "$$" },
      { name: "Mamasan", image: img("asian restaurant interior"), rating: 4.6, price: "$$$" }
    ],
    seasons: { best: [4, 5, 6, 7, 8, 9], avoid: [12, 1, 2] },
    highlights: [
      { place: "Uluwatu Temple", bestHours: "Golden hour (5–6:30pm)", image: img("uluwatu temple sunset") },
      { place: "Tegallalang Rice Terraces", bestHours: "Early morning (6–9am)", image: img("tegallalang rice terraces") }
    ]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    emoji: "🗻",
    image: img("tokyo skyline night"),
    topFoods: [
      { name: "Sushi", image: img("sushi platter"), rating: 4.8, price: "$$" },
      { name: "Ramen", image: img("ramen bowl"), rating: 4.7, price: "$" },
      { name: "Tempura", image: img("tempura shrimp"), rating: 4.5, price: "$$" },
      { name: "Okonomiyaki", image: img("okonomiyaki"), rating: 4.4, price: "$" }
    ],
    hotels: [
      { name: "Park Hyatt Tokyo", image: img("tokyo hotel skyline"), rating: 4.8, price: "$$$$" },
      { name: "Mandarin Oriental", image: img("luxury hotel tokyo"), rating: 4.8, price: "$$$$" },
      { name: "Shinjuku Granbell", image: img("tokyo hotel room"), rating: 4.4, price: "$$$" },
      { name: "Hotel Niwa", image: img("tokyo boutique hotel"), rating: 4.5, price: "$$$" }
    ],
    restaurants: [
      { name: "Sushi Dai", image: img("sushi chef counter"), rating: 4.8, price: "$$$$" },
      { name: "Ichiran", image: img("ramen counter"), rating: 4.6, price: "$$" },
      { name: "Tempura Kondo", image: img("tempura chef"), rating: 4.6, price: "$$$$" },
      { name: "Gyukatsu Motomura", image: img("gyukatsu"), rating: 4.6, price: "$$$" }
    ],
    seasons: { best: [3, 4, 10, 11], avoid: [8] },
    highlights: [
      { place: "Asakusa & Senso-ji", bestHours: "Morning (8–10am)", image: img("asakusa senso-ji") },
      { place: "Shibuya Crossing", bestHours: "Evening (6–9pm)", image: img("shibuya crossing") }
    ]
  },
  {
    id: "nyc",
    name: "New York City",
    country: "USA",
    emoji: "🗽",
    image: img("new york city skyline"),
    topFoods: [
      { name: "Bagels", image: img("new york bagel"), rating: 4.6, price: "$" },
      { name: "New York Pizza", image: img("new york pizza slice"), rating: 4.7, price: "$" },
      { name: "Cheesecake", image: img("new york cheesecake"), rating: 4.6, price: "$$" }
    ],
    hotels: [
      { name: "The Plaza", image: img("plaza hotel new york"), rating: 4.7, price: "$$$$" },
      { name: "The Standard", image: img("standard hotel high line"), rating: 4.5, price: "$$$" },
      { name: "Pod 39", image: img("pod hotel new york"), rating: 4.2, price: "$$" },
      { name: "Arlo NoMad", image: img("arlo nomad"), rating: 4.4, price: "$$$" }
    ],
    restaurants: [
      { name: "Katz's Deli", image: img("pastrami sandwich"), rating: 4.7, price: "$$" },
      { name: "Joe's Pizza", image: img("pizza new york"), rating: 4.7, price: "$" },
      { name: "Levain Bakery", image: img("chocolate chip cookie"), rating: 4.6, price: "$" },
      { name: "Los Tacos No.1", image: img("tacos new york"), rating: 4.6, price: "$" }
    ],
    seasons: { best: [5, 6, 9, 10], avoid: [1] },
    highlights: [
      { place: "Central Park", bestHours: "Morning (7–10am)", image: img("central park morning") },
      { place: "Top of the Rock", bestHours: "Sunset", image: img("top of the rock sunset") }
    ]
  },
  {
    id: "goa",
    name: "Goa",
    country: "India",
    emoji: "🏖️",
    image: img("goa beach sunset"),
    topFoods: [
      { name: "Prawn Balchão", image: img("prawn curry goa"), rating: 4.5, price: "$$" },
      { name: "Bebinca", image: img("bebinca dessert"), rating: 4.4, price: "$" },
      { name: "Goan Fish Curry", image: img("goan fish curry"), rating: 4.6, price: "$$" }
    ],
    hotels: [
      { name: "Taj Fort Aguada", image: img("taj fort aguada"), rating: 4.7, price: "$$$$" },
      { name: "Ahilya by the Sea", image: img("goa boutique hotel"), rating: 4.6, price: "$$$" },
      { name: "W Goa", image: img("w goa hotel"), rating: 4.5, price: "$$$$" },
      { name: "Vivanta Panaji", image: img("vivanta goa"), rating: 4.5, price: "$$$" }
    ],
    restaurants: [
      { name: "Gunpowder", image: img("south indian restaurant"), rating: 4.6, price: "$$$" },
      { name: "Vinayak Family Restaurant", image: img("fish thali goa"), rating: 4.5, price: "$$" },
      { name: "Thalassa", image: img("greek restaurant goa"), rating: 4.5, price: "$$$" },
      { name: "Burger Factory", image: img("gourmet burger"), rating: 4.4, price: "$$" }
    ],
    seasons: { best: [11, 12, 1, 2], avoid: [6, 7, 8] },
    highlights: [
      { place: "Anjuna Beach", bestHours: "Evening (5–7pm)", image: img("anjuna beach sunset") },
      { place: "Fort Aguada", bestHours: "Morning (8–10am)", image: img("fort aguada goa") }
    ]
  }
];

export const allSpotNames = SPOTS.map((s) => `${s.name}, ${s.country}`);
