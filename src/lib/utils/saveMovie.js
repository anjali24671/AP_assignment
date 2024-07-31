export async function saveMovie(movie) {
    const savedMovies = localStorage.getItem('savedMovies')
    
    let movies = savedMovies ? JSON.parse(savedMovies) : [];
    movies.push(movie);
    localStorage.setItem('savedMovies', JSON.stringify(movies));
    
}