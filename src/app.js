const API_KEY = '891e8e566b67876a73a99161069f603a'; 

    // Star SVG for rating icon
    const starSVG = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    `;

    async function searchMovies() {
      const query = document.getElementById("searchInput").value.trim();
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = "";

      if (!query) {
        resultsDiv.innerHTML = "<p>Please enter a movie name.</p>";
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
          resultsDiv.innerHTML = `<p>Error: ${response.status} ${response.statusText}</p>`;
          return;
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          resultsDiv.innerHTML = "<p>No results found.</p>";
          return;
        }

        // Sort movies by vote_average descending
        const sortedMovies = data.results.sort((a, b) => b.vote_average - a.vote_average);

        // Show top 5 results
        sortedMovies.slice(0, 5).forEach((movie) => {
          const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image";

          const div = document.createElement("div");
          div.className = "movie-card";
          div.innerHTML = `
            <img class="poster" src="${posterPath}" alt="${movie.title}" />
            <div class="movie-info">
              <div>
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-rating">${starSVG} <span>${movie.vote_average.toFixed(1)}</span></div>
              </div>
              <p class="movie-overview">${movie.overview || "No description available."}</p>
            </div>
          `;
          resultsDiv.appendChild(div);
        });
      } catch (error) {
        resultsDiv.innerHTML = `<p>Error fetching movies: ${error.message}</p>`;
      }
    }

    document.getElementById("searchBtn").addEventListener("click", searchMovies);

    document.getElementById("searchInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        searchMovies();
      }
    });