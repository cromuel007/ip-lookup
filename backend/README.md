# IP Lookup API

A Node.js + Express API for looking up IP address geolocation information using [`geoip-lite`](https://www.npmjs.com/package/geoip-lite). Lookup results are stored in PostgreSQL using Prisma.

## Tech Stack

* Node.js
* Express
* PostgreSQL 16
* Prisma 6
* geoip-lite
* Docker
* Docker Compose
* CORS
* Express Rate Limit

## Project Structure

```text
backend/
├── docker-compose.yml
├── .env.example
├── package.json
├── prisma/
│   ├── migrations/
│   └── schema.prisma
└── src/
    ├── controllers/
    │   └── ipController.js
    ├── lib/
    │   └── prisma.js
    ├── routes/
    │   └── ipRoutes.js
    ├── services/
    │   └── ipService.js
    └── server.js
```

> `.env` is created locally from `.env.example` and is not committed to the repository.

## Requirements

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* [Docker](https://www.docker.com/)
* Docker Compose

Verify the installations:

```bash
node -v
npm -v
docker -v
docker compose version
```

## 1. Install Dependencies

From the `backend` directory:

```bash
npm install
```

## 3. Start PostgreSQL with Docker

The project uses PostgreSQL running inside Docker.

Start PostgreSQL:

```bash
docker compose up -d
```

Check the container:

```bash
docker compose ps
```

The default local PostgreSQL configuration is:

```text
Host:     localhost
Port:     5432
Database: ip_lookup
Username: postgres
Password: postgres
```

PostgreSQL data is stored in a Docker volume so the data persists when the container is stopped or restarted.

> The default credentials are intended for local development only. Do not use these credentials in production.

## 4. Configure Environment Variables

The repository includes an `.env.example` file as a template.

Copy it to `.env`:

```bash
cp .env.example .env
```

The `.env.example` file contains:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ip_lookup?schema=public"
PORT=3001
```

After copying the file, update the values if your local or production configuration requires different settings.

> **Important:** Never commit `.env` or real database credentials to the public repository. The `.env` file is excluded through `.gitignore`, while `.env.example` is intentionally committed as a configuration template.

## 5. Generate Prisma Client

Run:

```bash
npx prisma generate
```

## 6. Run Database Migrations

For a new database, create the initial migration:

```bash
npx prisma migrate dev --name init
```

For subsequent schema changes:

```bash
npx prisma migrate dev --name <migration-name>
```

Check the migration status:

```bash
npx prisma migrate status
```

## 7. Start the API

Development mode:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3001
```

For production-style startup:

```bash
npm start
```

## 8. Test the API

### Health Check

Open:

```text
http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "IP Lookup API is running 🚀"
}
```

### IP Lookup

Example:

```text
http://localhost:3001/api/ip/lookup/8.8.8.8
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

Successful lookups are stored in the PostgreSQL `IpLookup` table.

If the IP has already been stored, the existing record is returned instead of creating another record.

## 9. IP Validation

The API supports both IPv4 and IPv6 addresses.

### Invalid IP

Example:

```text
http://localhost:3001/api/ip/lookup/hello
```

Response:

```json
{
  "error": "Invalid IP address"
}
```

### Private IP

Private and local addresses are rejected because they cannot be publicly geolocated.

Examples:

```text
127.0.0.1
192.168.1.1
10.0.0.1
172.16.0.1
```

Example response:

```json
{
  "error": "Private or local IP addresses cannot be geolocated"
}
```

## 10. Prisma Studio

To inspect the PostgreSQL database and lookup records:

```bash
npx prisma studio
```

Prisma Studio provides a browser-based interface for viewing the `IpLookup` table.

## 11. Stop PostgreSQL

Stop the Docker container:

```bash
docker compose down
```

The PostgreSQL data remains stored in the Docker volume.

Start it again:

```bash
docker compose up -d
```

## 12. Remove PostgreSQL and All Data

To remove the container and its database volume:

```bash
docker compose down -v
```

> **Warning:** The `-v` option deletes the PostgreSQL Docker volume and all stored database data.

After removing the database, recreate it with:

```bash
docker compose up -d
```

Then run:

```bash
npx prisma migrate dev
```

## Development Workflow

A typical development session:

```bash
# Start PostgreSQL
docker compose up -d

# Start the API
npm run dev
```

Test the API:

```text
http://localhost:3001/api/health
```

Test an IP:

```text
http://localhost:3001/api/ip/lookup/8.8.8.8
```

## API Endpoints

### Health Check

```http
GET /api/health
```

### Lookup IP

```http
GET /api/ip/lookup/:ip
```

Example:

```http
GET /api/ip/lookup/8.8.8.8
```

### Lookup Response

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

## Database

The application uses PostgreSQL with Prisma.

### Main Model

```text
IpLookup
```

Stored information includes:

* IP address
* Country code
* Country name
* Region
* City
* Timezone
* Latitude
* Longitude
* Lookup timestamp

The `ip` field is indexed for efficient lookups.

## Rate Limiting

The API uses `express-rate-limit` to limit incoming requests.

The current configuration allows:

```text
1000 requests
per 15 minutes
```

This helps reduce excessive requests against the public API.

## Important Notes

IP geolocation is approximate. The latitude and longitude represent the estimated geographic location associated with an IP address and should **not** be treated as an exact physical address.

`geoip-lite` may not have region or city information for every IP address.

The geolocation database is also periodically updated, so results may change over time.

## Security

This project is intended to be publicly accessible as source code.

Do not commit:

* `.env`
* Database passwords
* Production credentials
* API secrets
* Private keys
* Other sensitive configuration

Use environment variables for environment-specific configuration.

The `.env.example` file contains only local development defaults and is safe to commit as a configuration template. Replace these values with appropriate credentials when configuring other environments.

## Contact

* [LinkedIn](https://www.linkedin.com/in/cromuel/)
