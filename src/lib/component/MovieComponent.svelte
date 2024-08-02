<script>
    import { goto } from '$app/navigation';
    import { setMovie } from '../../stores/detailMovieStore';
    import saveMovies from '../utils/saveMovies';
    import removeMovie from '../utils/removeMovie';

    export let title;
    export let release_date;
    export let vote_average;
    export let genre_ids;
    export let poster_path;
    export let data;
    export let genre_list;

    let base_url = 'https://image.tmdb.org/t/p/w500';
    let poster;
    let save = false;

    // Dynamically create poster URL with cache-busting parameter
    $: poster = poster_path ? `${base_url}${poster_path}?${new Date().getTime()}` : null;

    // Compute genre names based on genre_ids
    $: genres = genre_ids
        ? genre_ids.map(id => {
            const genre = genre_list?.find(g => g.id === id);
            return genre ? genre.name : 'Unknown';
        }).join(', ')
        : 'Unknown';

    // Function to check if the movie is saved
    function checkIfSaved(movieId) {
        const savedMovies = JSON.parse(localStorage.getItem('saveMovies')) || [];
        return savedMovies.some(movie => movie.id === movieId);
    }

    // Initialize the save state based on localStorage
    $: save = checkIfSaved(data.id);

    function toggleSave() {
        if (save) {
            removeMovie(data.id);
            save = false;
        } else {
            saveMovies(data);
            save = true;
        }
    }

    function gotoDetail() {
        setMovie(data); // Set the movie data in the store
        goto(`/detail/${data.id}`); // Navigate to the detail page
    }
</script>

{#if poster}
    <div class="movie-card">
        <div class="poster-container">
            <button class="poster-button" on:click={gotoDetail}>
                <img class="poster-image" src={poster} alt={title} key={poster} />
            </button>
            <div class="rating-badge">
                {vote_average}
            </div>
        </div>
        <div class="movie-details">
            <h1 class="movie-title">{title}</h1>
            <div class="details-footer">
                <h2 class="movie-genres">{genres}</h2>
                <button class="save-button" on:click={toggleSave}>
                    {#if !save}
                        Save
                    {:else}
                        Remove
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .movie-card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        background-color: #fff;
    }

    .poster-container {
        position: relative;
        width: 200px;
        height: 300px;
        overflow: hidden;
        border-radius: 8px;
    }

    .poster-button {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        margin: 0;
    }

    .poster-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    }

    .rating-badge {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background-color: #ffeb3b;
        color: #000;
        padding: 5px 10px;
        border-radius: 50%;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .movie-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .movie-title {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0;
        color: #333;
    }

    .details-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .movie-genres {
        font-size: 0.9rem;
        color: #666;
    }

    .save-button {
        background-color: #ff5722;
        color: #fff;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s ease;
    }

    .save-button:hover {
        background-color: #e64a19;
    }
</style>
