import { TMDB_ACCESS_TOKEN } from "$env/static/private";
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const page = url.searchParams.get('page') || '1';
    const title = url.searchParams.get('title');

    if (!title) {
        return json({ error: 'Title is required' }, { status: 400 });
    }

    const endpoint = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&page=${page}`;

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
