import { getMovieDetails } from "../../../api/tmdb";
import { IMAGE_BASE_URL } from "../../../api/tmdb";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return {
    title: `${movie.title} | Cine-Stream`,
    description: movie.overview || "Discover movie details on Cine-Stream.",
  };
}

export default async function MovieDetail({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
        href="/"
        className="inline-block mb-4 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
        >
            &larr; Back to Home
        </Link>
        {movie.poster_path && (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-full max-w-sm mx-auto rounded-lg shadow-lg mb-6"
          />
        )}
        <h1 className="text-gray-900 dark:text-white text-3xl font-bold mb-2">
          {movie.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average?.toFixed(1)}
        </p>
        <p className="text-gray-700 dark:text-gray-300">{movie.overview}</p>
      </div>
    </div>
  );
}
