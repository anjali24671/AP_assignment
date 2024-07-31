import { TMDB_ACCESS_TOKEN } from '$env/static/private';

// Searches movies by name
export async function searchMovies(title, page=1) {
    try {
        let url = `https://api.themoviedb.org/3/movie/popular?query=${title}&page=${page}`

        const movieRes = fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`
            }
        }
        )

        if (!movieRes.ok) throw new Error(movieRes)
        
        const movies = await movieRes.json()
        return movies


    } catch (err) {
        return err
    }
}