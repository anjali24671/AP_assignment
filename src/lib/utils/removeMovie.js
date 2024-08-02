export default function removeMovie(movieId) {
    // Get the existing movies from localStorage or initialize as an empty array
    const movies = JSON.parse(localStorage.getItem('saveMovies')) || [];

    // Filter out the movie with the specified ID
    const updatedMovies = movies.filter(movie => movie.id !== movieId);

    // Save the updated array back to localStorage
    localStorage.setItem('saveMovies', JSON.stringify(updatedMovies));
}
