// src/routes/+page.js
import { TMDB_ACCESS_TOKEN } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function load({ fetch }) {
    try {
        const genreRes = await fetch('https://api.themoviedb.org/3/genre/movie/list', {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`
            }
        });
        const genre = await genreRes.json();
        console.log("genre",genre);

        return {
            genre: genre.genres
        };
    } catch (e) {
        console.error('Error fetching genres:', e);
        return {
            genre: []
        };
    }
}
