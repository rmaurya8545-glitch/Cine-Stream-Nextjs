"use client";

import MovieCard from "./MovieCard";

function MovieGrid({ movies, favorites, onToggleFavorite, lastMovieRef }){
    if(!movies || movies.length === 0){
        return(
            <p className="text-gray-500 dark:text-gray-400 
            text-center mt-10">No movies found.</p>
        );
    }
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 p-3 sm:p-4">
            {movies.map ((movie, index) => {
                const isLast = index === movies.length - 1;
                return(
                    <div ref = {isLast ? lastMovieRef : null} key={movie.id}>
                        <MovieCard
                        movie={movie}
                        isFavorite={favorites.some((fav) => fav.id === movie.id)}
                        onToggleFavorite = {onToggleFavorite} />
                    </div>
                );
            })}
        </div>
    );
}
export default MovieGrid;