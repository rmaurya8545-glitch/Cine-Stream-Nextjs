"use client";

import { useState } from "react";
import { getMoodBasedMovie } from "../api/gemini";
import { searchMovies } from "../api/tmdb";

function MoodMatcher({ onResult }) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood.trim()) return;

    setLoading(true);
    setError("");

    try {
      const movieTitle = await getMoodBasedMovie(mood);
      const searchResult = await searchMovies(movieTitle, 1);

      if (searchResult.results && searchResult.results.length > 0) {
        onResult(searchResult.results[0], movieTitle);
      } else {
        setError(`Couldn't find "${movieTitle}" on TMDB. Try again!`);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 bg-gray-100 dark:bg-gray-800 mx-4 rounded-lg my-4">
      <h3 className="text-gray-900 dark:text-white font-semibold mb-2">
        🎭 Mood Matcher — Tell us how you feel
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
  <input
    type="text"
    value={mood}
    onChange={(e) => setMood(e.target.value)}
    placeholder="e.g. I'm feeling sad but want a comedy movie."
    className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    disabled={loading}
    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium"
  >
    {loading ? "Thinking..." : "Suggest"}
  </button>
</form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default MoodMatcher;