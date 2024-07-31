import { TMDB_ACCESS_TOKEN } from '$env/static/private'


// search movies with filters such as genre, release year range and rating
export async function searchFilter(genreID, releaseYearStart, releaseYearEnd, rating) {
    try{
        const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreID}&release_date.gte=${releaseYearStart}&release_date.lte=${releaseYearEnd}&vote_average.gte=${rating}`

        const movieRes = await fetch(url, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`
            }
        })

        if (!movieRes.ok) throw new Error(movieRes)
        
        const movies = await movieRes.json()

        return movies
        
    } catch (err) {
        return err
    }
}