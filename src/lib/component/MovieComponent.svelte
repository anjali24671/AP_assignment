<script>
    import {goto} from '$app/navigation'
    import { setMovie } from '../../stores/detailMovieStore';
  
    export let title;
    export let release_date;
    export let vote_average;
    export let genre_ids;
    export let poster_path;
    export let data;
    console.log(data)

    let base_url = 'https://image.tmdb.org/t/p/w500';

    // Dynamically create poster URL with cache-busting parameter
    $: poster = poster_path ? `${base_url}${poster_path}?${new Date().getTime()}` : null;

    let save = false;

    // Compute genre names based on genre_ids
    $: genres = genre_ids
        ? genre_ids.map(id => {
            // Use optional chaining to safely access data.genre
            const genre = data.genre?.find(g => g.id === id);
            return genre ? genre.name : 'Unknown';
        }).join(', ')
        : 'Unknown';

    function toggleSave() {
        save = !save;
    }

    function gotoDetail() {
        setMovie(data); // Set the movie data in the store
        goto('/detail/hello'); // Navigate to the detail page
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
