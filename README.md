# APIx — SIH 2026 Demo Setup Guide

> **MoSPI · SIH 2026 · Problem Statement SIH26056**
> Real-time Airfare Price Index for India — Presentation Prototype

---

## Project Structure

```
demouu/
├── apix-backend/          # Node.js / Express / TypeScript / MongoDB
│   ├── src/
│   │   ├── config/        database.ts
│   │   ├── models/        FareObservation.ts, ApiLog.ts
│   │   ├── repositories/  fareRepository.ts, logRepository.ts
│   │   ├── services/      fareService.ts, scraperService.ts
│   │   ├── controllers/   fareController.ts, logController.ts, demoController.ts
│   │   ├── routes/        fareRoutes.ts, logRoutes.ts, demoRoutes.ts
│   │   ├── middleware/    requestLogger.ts
│   │   ├── utils/         analytics.ts
│   │   ├── types/         index.ts
│   │   └── server.ts
│   └── scripts/
│       └── mock-scraper.ts
└── apix-frontend/         # React / TypeScript / Tailwind / Recharts
    └── src/
        ├── api/           client.ts
        ├── components/    Header, SearchPanel, LoadingSteps, KpiCards,
        │                  FareChart, AnalyticsPanel, LogPanel
        └── App.tsx
```

---

## Environment Variables

### Backend — `apix-backend/.env`

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/apix?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### Frontend — `apix-frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Whitelist your IP (or `0.0.0.0/0` for the demo)
5. Get the connection string → paste into `MONGODB_URI`
6. Collections will be auto-created on first run: `fare_observations`, `api_logs`

---

## Installation

```bash
# Backend
cd apix-backend
npm install

# Frontend
cd ../apix-frontend
npm install
```

---

## Running the Project

### Terminal 1 — Backend

```bash
cd apix-backend
# Create .env from .env.example and fill MONGODB_URI
npm run dev
# → http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd apix-frontend
npm run dev
# → http://localhost:5173
```

---

## Mock Scraper (CLI)

```bash
cd apix-backend
npm run scrape
```

Expected output:
```
APIx Mock Scraper — SIMULATED DATA GENERATION
Sources scanned:   5
Routes processed:  6
Records collected: ~900
Valid records:     ~900
Records inserted:  ~900
Status:            SUCCESS
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/routes` | Available routes |
| GET | `/api/v1/airlines` | Available airlines |
| GET | `/api/v1/fares/today` | Today's fare summary |
| POST | `/api/v1/fare/analyze` | **Main analysis endpoint** |
| GET | `/api/v1/logs` | API activity logs |
| POST | `/api/v1/demo/scrape` | Trigger mock scraper |

### POST `/api/v1/fare/analyze`

```json
// Request
{ "origin": "DEL", "destination": "BOM", "airline": "IndiGo" }

// Response
{
  "route": "DEL-BOM",
  "airline": "IndiGo",
  "currentFare": 5420,
  "currency": "INR",
  "analytics": {
    "todayAverage": 5420,
    "sevenDayAverage": 5180,
    "thirtyDayAverage": 5350,
    "minimumFare": 4320,
    "maximumFare": 7890,
    "changeVs7Days": 4.63,
    "changeVs30Days": 1.31
  },
  "trend": {
    "direction": "INCREASING",
    "volatility": "MODERATE",
    "note": "Current price is above historical average"
  },
  "historicalData": [
    { "date": "2026-08-09", "averageFare": 4850, "minimumFare": 4300, "maximumFare": 6200 },
    ...
  ],
  "dataSource": "SIMULATED SCRAPED DATA — Mock Scraper v1.0",
  "disclaimer": "For demonstration purposes only. SIH 2026 prototype."
}
```

---

## Judge Demo Sequence

| Step | Action | What Happens |
|------|--------|--------------|
| 1 | Click **"Run Mock Scraper"** (top-right button) | `POST /demo/scrape` → generates ~900 records across 6 routes × 5 airlines × 35 days → inserts into MongoDB |
| 2 | Toast shows `✅ Scraper complete — N records inserted` | Data now lives in MongoDB Atlas |
| 3 | Select: **Delhi** → **Mumbai**, **IndiGo** | Dropdowns populated from `GET /routes` + `GET /airlines` |
| 4 | Click **"Analyze Fare"** | UI shows loading steps |
| 5 | *"Fetching fare data…"* | Frontend sends `POST /fare/analyze` |
| 6 | *"Querying database…"* | Backend runs 3 MongoDB queries (today / 7D / 30D) |
| 7 | *"Processing analytics…"* | Backend computes avg, median, min, max, % change, trend |
| 8 | Results appear | API log entry created in MongoDB |
| 9 | Dashboard shows | Current Fare · 7D Avg · 30D Avg · Min · Max · Price Change · 30-Day Recharts Graph · Trend · Volatility |
| 10 | **Live API Activity** panel (bottom-left) | Shows all API calls with timestamps, status codes, response times — auto-refreshes every 5s |

---

## Data Characteristics

- **35 days** of historical observations
- **6 routes**: DEL-BOM, DEL-BLR, BOM-BLR, DEL-CCU, BLR-HYD, MAA-DEL
- **5 airlines**: IndiGo, Air India, Air India Express, Akasa Air, SpiceJet
- **Realistic variation**: ±15% daily drift, weekend premiums, lead-time effects
- **Price spikes**: ~8% of observations spike 35–55% above base
- **SOLD_OUT / LIMITED** observations included (~10%)
- **Airline differentiation**: Air India = 18% premium, SpiceJet = 12% discount, etc.

---

> ⚠️ **Disclaimer**: All data is simulated. This is a SIH 2026 presentation prototype only.
> No real web scraping, ML models, or production infrastructure is used.
