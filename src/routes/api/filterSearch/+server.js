import { TMDB_ACCESS_TOKEN } from "$env/static/private";
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const genreId = url.searchParams.get('genre');
    const page = url.searchParams.get('page') || '1';
    const releaseYearStart = url.searchParams.get('releaseYearStart') || '0';
    const releaseYearEnd = url.searchParams.get('releaseYearEnd') || '2025';
    const rating = url.searchParams.get('rating');



    const endpoint = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&release_date.gte=${releaseYearStart}&release_date.lte=${releaseYearEnd}&vote_average=${rating}&page=${page}`;

    try {
        const res = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) {
            return json({ error: 'Failed to fetch movies' }, { status: res.status });
        }

        const movies = await res.json();
        return json(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        return json({ error: 'Error fetching movies' }, { status: 500 });
    }
}
