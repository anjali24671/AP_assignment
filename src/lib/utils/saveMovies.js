export default function saveMovies(movie) {
    // Get the existing movies from localStorage or initialize as an empty array
    const movies = JSON.parse(localStorage.getItem('saveMovies')) || [];

    // Add the new movie to the array
    movies.push(movie);

    // Save the updated array back to localStorage
    localStorage.setItem('saveMovies', JSON.stringify(movies));
}
