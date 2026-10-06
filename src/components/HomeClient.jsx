"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getPopularMovies, searchMovies } from "../api/tmdb";
import MovieGrid from "./MovieGrid";
import Navbar from "./Navbar";
import MoodMatcher from "./MoodMatcher";
import MovieCard from "./MovieCard";

export default function HomeClient({ initialMovies, initialTotalPages }) {
  const [movies, setMovies] = useState(initialMovies);
  const [favorites, setFavorites] = useState([]); 
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if(stored){
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [effectiveQuery, setEffectiveQuery] = useState("");
  const [hasMore, setHasMore] = useState(1 < initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [moodMovie, setMoodMovie] = useState(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Server ne pehle se page 1 ka popular-movies data de diya hai,
    // isliye pehli render pe dobara fetch mat karo
    if (isFirstRender.current && page === 1 && !query.trim() && !effectiveQuery) {
      isFirstRender.current = false;
      return;
    }
    isFirstRender.current = false;

    setLoading(true);

    const searchTerm = effectiveQuery || query;
    const fetchFn = searchTerm.trim()
      ? searchMovies(searchTerm, page)
      : getPopularMovies(page);

    fetchFn
      .then((data) => {
        let results = data.results || [];

        if (results.length === 0 && query.trim() && page === 1 && !effectiveQuery) {
          const words = query.trim().split(" ").filter((w) => w.length > 2);
          const fallbackWord = words.sort((a, b) => b.length - a.length)[0];

          if (fallbackWord && fallbackWord.toLowerCase() !== query.trim().toLowerCase()) {
            setEffectiveQuery(fallbackWord);
            return;
          }
        }

        setMovies((prev) => {
          if (page === 1) return results;
          const existingIds = new Set(prev.map((m) => m.id));
          const newResults = results.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newResults];
        });
        setHasMore(page < (data.total_pages || 1));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page, query, effectiveQuery]);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setEffectiveQuery("");
    setPage(1);
  };

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      if (exists) return prev.filter((fav) => fav.id !== movie.id);
      return [...prev, movie];
    });
  };

  const observer = useRef();
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <Navbar onSearch={handleSearch} />

      <div className="px-4 py-16 sm:py-20 text-center bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-gray-900">
        <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          🎬 Discover Your Next Favorite Movie
        </h2>
        <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Search, explore, and save movies you love — all in one place.
        </p>
      </div>

      <MoodMatcher onResult={(movie) => setMoodMovie(movie)} />

      {moodMovie && (
        <div className="px-4 mb-4">
          <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
            Recommended for your mood:
          </h3>
          <div className="max-w-50px">
            <MovieCard
              movie={moodMovie}
              isFavorite={favorites.some((fav) => fav.id === moodMovie.id)}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        </div>
      )}

      <MovieGrid
        movies={movies}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        lastMovieRef={lastMovieRef}
      />
      {loading && (
        <p className="text-gray-900 dark:text-white text-center py-4">
          Loading more movies...
        </p>
      )}
    </div>
  );
}
