<script>
    import { onMount } from 'svelte';
    import MovieComponent from '../lib/component/MovieComponent.svelte';

    export let data;

    let movieContainer;
    let intersector;
    let searchInput;
    let showFilter = false;
    let movies = [];

    onMount(async () => {
        searchInput = document.querySelector('#search');
        intersector = document.querySelector('#intersector');
        await fetchInitialMovies();
    });

    function showFilters() {
        showFilter = !showFilter;
        if (showFilter) {
            console.log('showing filters');
        }
    }

    async function fetchInitialMovies(page = '1') {
        try {
            const movieRes = await fetch(`/api/initialMovies?page=${page}`, {
                method: 'GET'
            });

            if (!movieRes.ok) {
                console.error(`Failed to fetch initial movies: ${movieRes.statusText}`);
                return;
            }

            const movies = await movieRes.json();
            console.log("Fetched movies:", movies);
        } catch (e) {
            console.error('Error fetching initial movies:', e);
        }
    }

    async function fetchSearchMovies(title, page = '1') {
        try {
            const movieRes = await fetch(`/api/searchMovies?title=${encodeURIComponent(title)}&page=${page}`, {
                method: 'GET'
            });

            if (!movieRes.ok) {
                console.error(`Failed to search movies: ${movieRes.statusText}`);
                return;
            }

            const moviesData = await movieRes.json();
            const movies = moviesData.results;
            console.log(movies);
        } catch (e) {
            console.error('Error searching movies:', e);
        }
    }

    async function fetchFilterSearch() {
        const genre = document.querySelector('#genre-id').value;
        const releaseYearStart = document.querySelector('#releaseStart').value;
        const releaseYearEnd = document.querySelector('#releaseEnd').value;
        const rating = document.querySelector('#rating').value;

        try {
            const filterRes = await fetch(`/api/filterSearch?genre=${genre}&releaseYearStart=${releaseYearStart}&releaseYearEnd=${releaseYearEnd}&rating=${rating}`, {
                method: 'GET'
            });

            if (!filterRes.ok) {
                console.error(`Failed to fetch filtered search: ${filterRes.statusText}`);
                return;
            }

            const filter = await filterRes.json();
            console.log(filter);
        } catch (e) {
            console.error('Error fetching filtered search:', e);
        }
    }

    function handleGenreInput(event) {
        const selectedOption = Array.from(document.querySelector('#genre-list').options).find(option => option.value === event.target.value);
        if (selectedOption) {
            document.querySelector('#genre-id').value = selectedOption.getAttribute('data-id');
        }
    }
</script>

<div class="flex items-center gap-5 justify-center flex-col">
    <h1 class="text-green-400">The Movie Browser</h1>
    <div class="relative">
        <input id="search" placeholder="Search a movie..." list="genre-list">
        <button on:click={() => fetchSearchMovies(searchInput.value)}>Search</button>
        <button on:click={showFilters}>Filter</button>

        {#if showFilter}
            <div class="absolute flex z-10 flex-col my-2 p-3 bg-red-400 w-full">
                <label>Genre</label>
                <input id="genre" placeholder="Search genres..." list="genre-list" on:input={handleGenreInput}>
                <input type="hidden" id="genre-id">
                <datalist id="genre-list">
                    {#each data.genre as genre}
                        <option value={genre.name} data-id={genre.id}></option>
                    {/each}
                </datalist>

                <label>Release Year</label>
                <div class="flex w-[90%] gap-2">
                    <div>
                        <input id="releaseStart" class="w-[50px]" placeholder="From">
                    </div>
                    <div>
                        <input id="releaseEnd" class="w-[50px]" placeholder="To">
                    </div>
                </div>

                <label>Rating</label>
                <input id="rating">

                <button on:click={fetchFilterSearch}>Search</button>
            </div>
        {/if}
    </div>

    <div bind:this={movieContainer} class="grid lg:grid-cols-5 grid-cols-2">
        {#each movies as movie}
            <MovieComponent
                title={movie.title}
                release_date={movie.release_date}
                vote_average={movie.vote_average}
                genre_ids={movie.genre_ids}
                poster_path={movie.poster_path}
            />
        {/each}
    </div>
    <div id="intersector">Loading more...</div>
</div>
