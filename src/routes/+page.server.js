import { TMDB_ACCESS_TOKEN } from '$env/static/private';

export async function load() {
    const url = 'https://api.themoviedb.org/3/movie/popular';

    const options = {
        method: 'GET',
        headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`
        }
    };

    try {
        // const response = await fetch(url, options);

        // if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        // const data = await response.json();
        // console.log("Response:", data);

        return {
        props: {
            movieData: "data"
        }
        };
    } catch (err) {
        console.error('Error fetching data:', err);

        return {
        props: {
            movieData: null,
            error: err.message
        }
        };
    }
    }
