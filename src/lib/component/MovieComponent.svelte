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
    <div class="flex flex-col gap-1 mx-4 my-3">
        <div class="w-[200px] h-[250px] relative bg-green-100 shadow-l-lg">
            <button on:click={gotoDetail}>
                <img class="w-full h-full object-cover" src={poster} alt={title} key={poster} on:load={() => console.log('Image loaded')} />
            </button>
            <div class="w-[50px] h-[50px] absolute bottom-5 rounded-[50%] right-[-20px] flex items-center justify-center bg-yellow-100">
                {vote_average}
            </div>
        </div>
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-lg mt-2">{title}</h1>
                <h2>{genres}</h2>
            </div>
            <button on:click={toggleSave}>
                {#if !save}
                    Save
                {:else}
                    Remove
                {/if}
            </button>
        </div>
    </div>
{/if}
