const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../frontend")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/movies", async (req, res) => {
  const { query, year, sort } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "A movie title is required." });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not configured on the server." });
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    query: query.trim(),
    include_adult: false,
    language: "en-US",
    page: 1,
  });

  if (year) params.append("year", year);

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?${params}`,
    );

    if (!response.ok) {
      console.error("TMDB error:", response.status);
      return res.status(502).json({ error: "Failed to reach TMDB API." });
    }

    const data = await response.json();
    let movies = data.results || [];

    if (sort === "rating") {
      movies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sort === "newest") {
      movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sort === "oldest") {
      movies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    } else if (sort === "popularity") {
      movies.sort((a, b) => b.popularity - a.popularity);
    }

    const formatted = movies.map((m) => ({
      id: m.id,
      title: m.title,
      overview: m.overview || "No description available.",
      releaseDate: m.release_date || null,
      rating: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
      voteCount: m.vote_count || 0,
      poster: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : null,
      tmdbUrl: `https://www.themoviedb.org/movie/${m.id}`,
    }));

    res.json({ total: formatted.length, movies: formatted });
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
