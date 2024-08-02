<script>
    import { detailMovieStore, clearMovie } from '../../../stores/detailMovieStore';
    import { onDestroy } from 'svelte';
    import saveMovie from '../../../lib/utils/saveMovies'; // Adjust the path accordingly
    import removeMovie from '../../../lib/utils/removeMovie'; // Adjust the path accordingly

    let movie = null;
    let isSaved = false; // Track if the movie is saved or not

    const unsubscribe = detailMovieStore.subscribe(value => {
        movie = value;
        isSaved = checkIfSaved(movie.id); // Check if the movie is already saved
    });

    onDestroy(() => {
        unsubscribe();
        clearMovie();
    });

    function checkIfSaved(movieId) {
        const savedMovies = JSON.parse(localStorage.getItem('saveMovies')) || [];
        return savedMovies.some(movie => movie.id === movieId);
    }

    function handleSaveRemove() {
        if (isSaved) {
            removeMovie(movie.id);
            isSaved = false;
        } else {
            saveMovie(movie);
            isSaved = true;
        }
    }
</script>

{#if movie}
    <div class="flex flex-col items-center justify-center">
        <div class="flex justify-center w-[90%] p-9 m-9 gap-3 items-center">
            <div class="flex-shrink-0">
                <img class="cover" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <button on:click={handleSaveRemove}>
                    {isSaved ? 'Remove' : 'Save'}
                </button>
            </div>
            <div>
                <h1>{movie.title}</h1>
                <div>{movie.vote_average} stars</div>
                <div>{movie.genres ? movie.genres.map(g => g.name).join(', ') : 'Unknown'}</div>
                <div>{movie.overview}</div>
            </div>
        </div>
    </div>
{:else}
    <p>Loading...</p>
{/if}
