"use client";
import { IMAGE_BASE_URL } from "../api/tmdb";
import Link from "next/link";

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  return (
    <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
      <button
        onClick={() => onToggleFavorite(movie)}
        className="absolute top-2 right-2 text-2xl z-10"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <Link href={`/movie/${movie.id}`}>
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="w-full h-auto object-cover aspect-2/3"
          />
        ) : (
          <div className="w-full aspect-2/3 bg-linear-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🎬</span>
            <span className="text-gray-400 text-xs text-center px-2">No Poster Available</span>
          </div>
        )}

        <div className="p-3">
          <h3 className="text-gray-900 dark:text-white font-semibold text-xs truncate">
            {movie.title}
          </h3>
          <div className="flex justify-between items-center mt-1 text-gray-500 dark:text-gray-400 text-xs">
            <span>{movie.release_date?.slice(0, 4) || "N/A"}</span>
            <span className="text-yellow-400">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;