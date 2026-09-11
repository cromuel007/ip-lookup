# IP Lookup

A full-stack IP geolocation lookup application with a modern dark developer-tool interface.

## 🚀 Live Demo

**https://ip-lookup-rho.vercel.app/**

## Backend

The backend is a REST API built with **Node.js, Express, PostgreSQL, and Prisma**.

It uses **geoip-lite** to retrieve approximate geographic information for an IP address and stores lookup results in PostgreSQL.

### Backend Features

* IP address validation
* IPv4 and IPv6 support
* Approximate IP geolocation
* Country, region, city, and timezone information
* Latitude and longitude
* PostgreSQL lookup storage
* Prisma ORM
* CORS protection
* Rate limiting
* Private/local IP rejection
* Dockerized PostgreSQL development environment

## Frontend

The frontend is built with **React, TypeScript, Vite, and Tailwind CSS**.

It provides a responsive interface for entering an IP address and displaying the lookup results with country flags and an interactive map.

### Frontend Features

* IP lookup interface
* Responsive modern dark UI
* Country flag display
* Geographic information display
* Interactive Leaflet map
* OpenStreetMap tiles
* Animated location marker
* Location popup
* Smooth scrolling to lookup results
* API error handling

## Tech Stack

**Backend**

* Node.js
* Express
* PostgreSQL
* Prisma
* geoip-lite
* Docker

**Frontend**

* React
* TypeScript
* Vite
* Tailwind CSS
* Leaflet
* React Leaflet
* country-flag-icons

## Project Structure

```text
ip-lookup/
├── backend/
└── frontend/
```

## Author

**Cromuel**

[LinkedIn](https://www.linkedin.com/in/cromuel/) · [GitHub](https://github.com/cromuel007)
