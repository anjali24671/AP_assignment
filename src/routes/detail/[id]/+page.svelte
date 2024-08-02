<script>
    import { detailMovieStore, clearMovie } from '../../../stores/detailMovieStore';
    import { onDestroy } from 'svelte';

    let movie = null;

    const unsubscribe = detailMovieStore.subscribe(value => {
        movie = value;
    });

    onDestroy(() => {
        unsubscribe();
        clearMovie();
    });
</script>

{#if movie}
    <div class="flex flex-col items-center justify-center">
        <div class="flex justify-center w-[90%] p-9 m-9 gap-3 items-center">
            <div class="flex-shrink-0">
                <img class="cover" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <button>Save</button>
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
