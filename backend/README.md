# MovieFinder — Backend

A lightweight Node.js/Express server that acts as a secure proxy between the MovieFinder frontend and the [TMDB API](https://www.themoviedb.org/documentation/api). It handles API key management, request validation, rate limiting, and result sorting — keeping all sensitive credentials off the client.

---

## Features

- **Movie search** — queries the TMDB search API by title, with optional year filtering
- **Server-side sorting** — sort results by popularity, rating, release date (newest or oldest)
- **Rate limiting** — 20 requests per minute per client to prevent abuse
- **Static file serving** — serves the frontend directly, so no separate web server is needed
- **Environment-based config** — API key and port are loaded from a `.env` file, never exposed to the browser

---

## Tech Stack

| Package | Purpose |
|---|---|
| [Express 5](https://expressjs.com/) | HTTP server and routing |
| [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) | Per-IP rate limiting |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable loading |
| [nodemon](https://nodemon.io/) | Auto-restart during development |

---

## Getting Started

### PrerequisitesPORT=3002
TMDB_API_KEY=5a5350d65b8242e76a9da1c9d557bfc2

- Node.js 18+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=3002
TMDB_API_KEY=your_tmdb_api_key_here
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Running

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
node app.js
```

The server starts on the port defined in `.env` (default: `3000`).
The frontend is served at `http://localhost:<PORT>/`.

---

## API Reference

### `GET /api/movies`

Search for movies by title.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | Yes | Movie title to search for |
| `year` | string | No | Filter by release year (e.g. `2023`) |
| `sort` | string | No | Sort order: `popularity`, `rating`, `newest`, `oldest` |

**Success Response — `200 OK`**

```json
{
  "total": 3,
  "movies": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "Cobb, a skilled thief...",
      "releaseDate": "2010-07-16",
      "rating": "8.4",
      "voteCount": 35821,
      "poster": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      "tmdbUrl": "https://www.themoviedb.org/movie/27205"
    }
  ]
}
```

**Error Responses**

| Status | Condition |
|---|---|
| `400 Bad Request` | `query` parameter is missing or empty |
| `500 Internal Server Error` | `TMDB_API_KEY` is not set, or an unexpected server error occurred |
| `502 Bad Gateway` | TMDB API returned an error |
| `429 Too Many Requests` | Rate limit exceeded (20 req/min) |

---

## Project Structure

```
backend/
├── app.js          # Entry point — Express app, routes, middleware
├── package.json
├── .env            # Secret config (not committed)
└── .gitignore
```

---

## Rate Limiting

The `/api/movies` endpoint is limited to **20 requests per minute** per IP address. Clients that exceed this limit receive a `429` response with the message:

```json
{ "error": "Too many requests. Please wait a moment and try again." }
```

---

## Data Source

Movie data is provided by [The Movie Database (TMDB)](https://www.themoviedb.org).
This product uses the TMDB API but is not endorsed or certified by TMDB.
