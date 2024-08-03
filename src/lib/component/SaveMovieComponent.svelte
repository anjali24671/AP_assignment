<script>
    import { onMount } from 'svelte';
    import { setMovie } from '../../stores/detailMovieStore';
    import { goto } from '$app/navigation'

    let saveMovies = [];

    onMount(() => {
        // Retrieve saved movies from local storage
        const saveMoviesData = localStorage.getItem('saveMovies');
        if (saveMoviesData) {
            saveMovies = JSON.parse(saveMoviesData);
        }
    });

  

    function removeMovie(id) {
        saveMovies = saveMovies.filter(movie => movie.id !== id);
        localStorage.setItem('saveMovies', JSON.stringify(saveMovies));
    }

    function gotoDetail(id) {
        setMovie(id); // Set the movie data in the store
        console.log('hellp')
        goto(`/detail/${id}`); // Navigate to the detail page
    }
</script>

{#if saveMovies.length === 0}
    <p>No saved movies found.</p>
{:else}
    <div class="saved-movies-container">
        {#each saveMovies as movie (movie.id)}
            <div class="movie-card" on:click={()=>gotoDetail(movie.id)}>
                <button class="poster-container">
                    <img class="poster-image" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}>
                </button>
                <div class="movie-details">
                    <h1 class="movie-title">{movie.title}</h1>
                   
                    <div class="movie-overview">{movie.overview}</div>
                    <div class="release-date">Release Date: {movie.release_date.split('-')[0]}</div>
                    <button class="remove-button" on:click={() => removeMovie(movie.id)}>Remove</button>
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    .saved-movies-container {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        margin: 2rem;
    }

    @media (min-width: 1200px) {
        .saved-movies-container {
            grid-template-columns: 1fr 1fr;
        }
    }

    .movie-card {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .movie-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    }

    .poster-container {
        flex: 0 0 200px;
        height: 300px;
        overflow: hidden;
        border-radius: 8px;
    }

    .poster-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .movie-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .movie-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0;
        color: #333;
    }

    .movie-genres {
        font-size: 1rem;
        color: #777;
    }

    .movie-overview {
        font-size: 1rem;
        color: #555;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .release-date {
        font-size: 0.9rem;
        color: #999;
    }

    .remove-button {
        align-self: flex-start;
        background-color: #ff5722;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.3s ease;
    }

    .remove-button:hover {
        background-color: #e64a19;
    }
</style>
