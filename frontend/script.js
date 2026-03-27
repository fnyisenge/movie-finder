const form = document.getElementById("searchForm");
const resultSection = document.getElementById("results");
const statusBar = document.getElementById("statusBar");
const searchBtn = document.getElementById("searchBtn");

const showStatus = (message, type) => {
  statusBar.textContent = message;
  statusBar.className = `status-bar ${type}`;
};

const hideStatus = () => {
  statusBar.className = "status-bar hidden";
};

const escapeHtml = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatYear = (dateStr) => {
  if (!dateStr) return "Unknown year";
  return dateStr.substring(0, 4);
};

const starRating = (score) => {
  const num = parseFloat(score);
  if (isNaN(num)) return "";
  const filled = Math.round(num / 2);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
};

const renderMovies = (movies) => {
  if (!movies.length) {
    resultSection.innerHTML = "";
    showStatus("No movies found. Try a different title or year.", "info");
    return;
  }

  showStatus(
    `Found ${movies.length} result${movies.length > 1 ? "s" : ""}`,
    "success",
  );

  resultSection.innerHTML = movies
    .map(
      (m) => `
    <div class="movie-card">
      <div class="poster-wrap">
        ${
          m.poster
            ? `<img src="${escapeHtml(m.poster)}" alt="${escapeHtml(m.title)}" loading="lazy" />`
            : `<div class="no-poster">🎬</div>`
        }
        ${m.rating ? `<div class="rating-badge">★ ${m.rating}</div>` : ""}
      </div>
      <div class="card-body">
        <h2 class="card-title">${escapeHtml(m.title)}</h2>
        <div class="card-year">${formatYear(m.releaseDate)}</div>
        <p class="card-overview">${escapeHtml(m.overview)}</p>
      </div>
      <a class="card-link" href="${escapeHtml(m.tmdbUrl)}" target="_blank" rel="noopener noreferrer">
        View on TMDB →
      </a>
    </div>
  `,
    )
    .join("");
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideStatus();

  const query = document.getElementById("query").value.trim();
  const year = document.getElementById("year").value.trim();
  const sort = document.getElementById("sort").value;

  if (!query) {
    showStatus("Please enter a movie title.", "error");
    return;
  }

  searchBtn.disabled = true;
  searchBtn.textContent = "Searching...";
  resultSection.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Searching for movies...</p>
    </div>`;

  const params = new URLSearchParams({ query, sort });
  if (year) params.append("year", year);

  try {
    const res = await fetch(`http://localhost:3002/api/movies?${params}`);
    const data = await res.json();

    if (!res.ok) {
      showStatus(data.error || "An error occurred.", "error");
      resultSection.innerHTML = "";
      return;
    }

    renderMovies(data.movies);
  } catch {
    showStatus(
      "Could not connect to the server. Make sure the backend is running.",
      "error",
    );
    resultSection.innerHTML = "";
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Magic";
  }
});
