async function removeMovie(movie) {
    const savedMovies = localStorage.getItem('savedMovies');

    let movies = JSON.parse(savedMovies)

    movies = movies.filter(saveMovie => saveMovie.id !== movie.id)

    localStorage.setItem('savedMovies', JSON.stringify(movies))
}