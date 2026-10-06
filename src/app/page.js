import HomeClient from "../components/HomeClient";
import { getPopularMovies } from "../api/tmdb";

export default async function Home() {
  const data = await getPopularMovies(1);

  return (
    <HomeClient
      initialMovies={data.results || []}
      initialTotalPages={data.total_pages || 1}
    />
  );
}
