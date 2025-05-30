"use client"; // Because we are using React state & hooks

import React, { useState } from "react";

const API_KEY = "891e8e566b67876a73a99161069f603a";

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="inline w-4 h-4 fill-yellow-400"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function Page() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchMovies() {
    if (!query.trim()) {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setError("No results found.");
        setLoading(false);
        return;
      }

      // Sort by vote_average descending and take top 5
      const sortedMovies = data.results
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 5);

      setMovies(sortedMovies);
    } catch (err) {
      setError(`Error fetching movies: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      searchMovies();
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Movie Search App</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow px-4 py-2 border border-gray-300 rounded"
        />
        <button
          onClick={searchMovies}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card flex gap-4 p-4 bg-white shadow rounded"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/100x150?text=No+Image"
              }
              alt={movie.title}
              className="w-[100px] h-[150px] object-cover rounded"
            />
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between items-center mb-1">
                <h3 className="movie-title text-lg font-semibold">
                  {movie.title}
                </h3>
                <div className="movie-rating flex items-center gap-1 text-yellow-400 font-semibold">
                  <StarIcon />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <p className="movie-overview text-gray-700 line-clamp-3">
                {movie.overview || "No description available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
