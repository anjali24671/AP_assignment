<script>
    import { onMount } from 'svelte';

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
</script>

{#if saveMovies.length === 0}
    <p>No saved movies found.</p>
{:else}
    {#each saveMovies as movie (movie.id)}
        <div class="flex gap-4 max-w-[700px]">
            <div class="w-[200px]">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}>
            </div>
            <div class="flex">
                <div>
                    <h1 class="text-lg font-semibold">{movie.title}</h1>
                    <h2>{movie.genre_ids.join(', ')}</h2>
                    <div>{movie.overview}</div>
                    <div>Release Date: {movie.release_date}</div>
                </div>
                <button on:click={() => removeMovie(movie.id)}>Remove</button>
            </div>
        </div>
    {/each}
{/if}
