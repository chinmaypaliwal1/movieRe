"use client";
import '../styles/globals.css';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <h1 className="text-center text-3xl font-bold mb-6">MovieFinder</h1>

      <div className="flex justify-center mb-10 max-w-xl mx-auto gap-2">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Type movie name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 text-white px-6 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300"
          onClick={searchMovies}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <p className="text-center text-red-600 mb-6">{error}</p>
      )}

      <div
        id="results"
        className=" grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 max-w-7xl mx-auto"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="movie-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition"
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="poster w-full aspect-[2/3] object-cover bg-gray-200"
              />
            ) : (
              <div className="poster w-full aspect-[2/3] bg-gray-300 flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}

            <div className="movie-info p-4 flex flex-col justify-between h-48">
              <h2 className="movie-title font-bold text-lg text-gray-900 mb-2">
                {movie.title}
              </h2>

              <div className="movie-rating flex items-center gap-1 text-yellow-400 font-semibold mb-2">
                <StarIcon /> {movie.vote_average.toFixed(1)}
              </div>

              <p className="movie-overview text-gray-600 text-sm line-clamp-3">
                {movie.overview || "No description available."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
