const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async (page = 1) =>{
    const res = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    if(!res.ok) throw new Error("Failed to fetch popular movies");
    return res.json();
};

export const searchMovies = async(query, pages = 1) => {
    const res = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            query
        )}&page=${pages}`
    );
    if(!res.ok) throw new Error("Failed to fetch search result");
    return res.json();
};

export const getMovieDetails = async (id) => {
    const res = await fetch(
        `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
    if(!res.ok) throw new Error("Failed to fetch movie details");
    return res.json();
};
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";


