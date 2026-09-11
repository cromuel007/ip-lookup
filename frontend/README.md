# IP Lookup — Frontend

A React + TypeScript frontend for the IP Lookup API, featuring a dark underground terminal-inspired interface for looking up approximate IP geolocation data.

The application allows users to enter an IP address and view approximate geolocation information, including country, region, city, timezone, coordinates, and an interactive map.

## Features

* 🔎 IP address lookup
* 🌍 Approximate IP geolocation
* 🗺️ Interactive Leaflet map
* 📍 Animated map marker
* 🎯 Location popup
* ⚡ Smooth scrolling to lookup results
* 🌑 Deep-web / underground terminal-inspired UI
* 📱 Responsive design
* 🚨 API error handling
* 🔌 Configurable backend API URL
* 🇺🇸 Country flag display
* ⚛️ React 19
* 🟦 TypeScript
* 🎨 Tailwind CSS
* 🗺️ React Leaflet

## Tech Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Leaflet
* React Leaflet
* country-flag-icons
* ESLint

## Project Structure

```text
frontend/
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── site.webmanifest
│
├── src/
│   ├── components/
│   │   └── IpMap.tsx
│   │
│   ├── services/
│   │   └── ipApi.ts
│   │
│   ├── types/
│   │   └── ip.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Requirements

* Node.js 18+
* npm 9+
* IP Lookup API running locally or remotely

## Installation

From the `frontend` directory:

```bash
npm install
```

## Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

The `.env.example` file contains:

```env
VITE_API_URL="http://localhost:3001"
```

### `VITE_API_URL`

The URL of the IP Lookup backend API.

For local development:

```env
VITE_API_URL="http://localhost:3001"
```

For production, replace it with your deployed API URL:

```env
VITE_API_URL="https://your-api-domain.com"
```

## Development

Start the Vite development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Build

Create a production build:

```bash
npm run build
```

The production files will be generated in:

```text
dist/
```

## Preview Production Build

After building:

```bash
npm run preview
```

## Lint

Run ESLint:

```bash
npm run lint
```

## API Integration

The frontend communicates with the backend through:

```text
GET /api/ip/lookup/:ip
```

For example:

```text
GET http://localhost:3001/api/ip/lookup/8.8.8.8
```

Example response:

```json
{
  "ip": "8.8.8.8",
  "country": {
    "code": "US",
    "name": "United States"
  },
  "region": null,
  "city": null,
  "timezone": "America/Chicago",
  "location": {
    "latitude": 37.751,
    "longitude": -97.822
  }
}
```

The API URL is configured through:

```env
VITE_API_URL
```

and consumed by:

```text
src/services/ipApi.ts
```

## Map

The application uses **Leaflet** and **React Leaflet** to display the approximate IP location.

Map tiles are provided by OpenStreetMap:

```text
https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

OpenStreetMap attribution is displayed on the map as required by its usage terms.

The map retains the standard OpenStreetMap map appearance while the surrounding interface uses the deep-web terminal theme.

## Important Notes

### Geolocation Accuracy

IP geolocation is approximate. The displayed location may not represent the exact physical location of the IP address.

The backend uses `geoip-lite` for IP geolocation.

### Private IP Addresses

Private and local addresses such as:

```text
127.0.0.1
192.168.x.x
10.x.x.x
172.16.x.x - 172.31.x.x
```

cannot be meaningfully geolocated and are rejected by the backend.

### Environment Files

Do not commit `.env` files containing environment-specific configuration.

Use `.env.example` as the template:

```bash
cp .env.example .env
```

## Production Deployment

The frontend can be deployed to platforms such as:

* Vercel
* Netlify
* Cloudflare Pages
* Render
* Any static hosting provider

Before deploying, configure:

```env
VITE_API_URL="https://your-api-domain.com"
```

Then build the application:

```bash
npm run build
```

Deploy the generated `dist/` directory or connect the repository directly to your hosting provider.

## Related Project

This frontend works with the IP Lookup backend located in:

```text
../backend
```

The backend provides:

```text
GET /api/health
GET /api/ip/lookup/:ip
```

## Contact

* [LinkedIn](https://www.linkedin.com/in/cromuel/)
