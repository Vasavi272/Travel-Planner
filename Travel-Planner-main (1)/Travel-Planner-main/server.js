// server.js
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const AM_BASE = "https://test.api.amadeus.com";
let cachedToken = null;
let tokenExp = 0;

async function getToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExp - 30_000) return cachedToken;

  const res = await fetch(`${AM_BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Token error: ${res.status} ${t}`);
  }
  const j = await res.json();
  cachedToken = j.access_token;
  tokenExp = Date.now() + j.expires_in * 1000;
  return cachedToken;
}

// GET /api/amadeus/flight-offers?origin=HYD&destination=DEL&date=2025-11-20&adults=1
app.get("/api/amadeus/flight-offers", async (req, res) => {
  try {
    const { origin, destination, date, adults = 1, nonStop } = req.query;
    if (!origin || !destination || !date) {
      return res.status(400).json({ error: "origin, destination, date required" });
    }

    const token = await getToken();
    const url = new URL(`${AM_BASE}/v2/shopping/flight-offers`);
    url.searchParams.set("originLocationCode", origin.toUpperCase());
    url.searchParams.set("destinationLocationCode", destination.toUpperCase());
    url.searchParams.set("departureDate", date);
    url.searchParams.set("adults", String(adults));
    url.searchParams.set("currencyCode", "USD");
    if (nonStop === "true") url.searchParams.set("nonStop", "true");
    url.searchParams.set("max", "30");

    const amRes = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await amRes.json();
    if (!amRes.ok) {
      return res.status(amRes.status).json({ error: data });
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Amadeus proxy on http://localhost:${PORT}`));
