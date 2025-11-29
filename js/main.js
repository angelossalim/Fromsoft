// Enhanced search behavior:
// - On pages that have .game elements (games.html) the input filters the list live.
// - On other pages, pressing Enter or clicking the search button redirects to games.html?q=... and the games page applies the filter.
// - Debounced input handler for smoother typing.
// - Reads ?q= from URL and pre-applies filter when arriving on games.html.

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.querySelector(".search-box button");
  const games = Array.from(document.querySelectorAll(".game"));

  if (!searchInput) return;

  // debounce helper
  function debounce(fn, delay = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  // normalize text for comparison
  function normalize(text) {
    return (text || "").toLowerCase().trim();
  }

  // apply filter to games list
  function applyFilter(filterText) {
    const f = normalize(filterText);
    if (games.length === 0) return;
    games.forEach(game => {
      // game title could be in h3, or in link text — check safely
      const titleEl = game.querySelector("h3");
      const title = titleEl ? normalize(titleEl.textContent) : normalize(game.textContent);
      game.style.display = title.includes(f) ? "block" : "none";
    });
  }

  // If we're on the games page (there are .game items), support live filtering and pre-fill from ?q=
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get("q");

  if (games.length > 0) {
    // If a query param exists, prefill and run the filter
    if (qParam) {
      searchInput.value = qParam;
      applyFilter(qParam);
      // remove q param from URL without reloading (optional)
      const newUrl = window.location.pathname;
      history.replaceState({}, "", newUrl);
    }

    // Live filter on input with debounce
    const onInput = debounce(() => applyFilter(searchInput.value), 120);
    searchInput.addEventListener("input", onInput);

    // Allow Enter key to keep user on the page and just filter
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyFilter(searchInput.value);
      }
    });

    // If button exists, clicking it does the same as Enter (filter)
    if (searchButton) {
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        applyFilter(searchInput.value);
      });
    }

    return;
  }

  // If we're NOT on the games page, pressing Enter or clicking search should go to games.html?q=...
  function redirectToGames() {
    const q = normalize(searchInput.value);
    // If empty, just go to games page
    const target = q ? `games.html?q=${encodeURIComponent(q)}` : "games.html";
    window.location.href = target;
  }

  // Enter key -> redirect
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      redirectToGames();
    }
  });

  // Button click -> redirect
  if (searchButton) {
    searchButton.addEventListener("click", (e) => {
      e.preventDefault();
      redirectToGames();
    });
  }
});