<script>
    import { onMount } from 'svelte';
    import MovieComponent from '../lib/component/MovieComponent.svelte';

    export let data;

    let movieContainer;
    let intersector;
    let searchInput;
    let showFilter = false;
    let movies = [];
    let savedMovies = new Set(); // To keep track of saved movie IDs
    let isLoading = true; // State variable for loading

    onMount(async () => {
        searchInput = document.querySelector('#search');
        intersector = document.querySelector('#intersector');
        await fetchInitialMovies();
    });

    function showFilters() {
        showFilter = !showFilter;
    }

    async function fetchInitialMovies(page = '1') {
        isLoading = true; // Set loading to true before fetch
        try {
            const movieRes = await fetch(`/api/initialMovies?page=${page}`);
            if (!movieRes.ok) throw new Error(`Failed to fetch initial movies: ${movieRes.statusText}`);
            const moviesData = await movieRes.json();
            movies = moviesData.results;
        } catch (e) {
            console.error('Error fetching initial movies:', e);
        } finally {
            isLoading = false; // Set loading to false after fetch (either success or error)
        }
    }

    async function fetchSearchMovies(title, page = '1') {
        isLoading = true; // Set loading to true before fetch
        try {
            const movieRes = await fetch(`/api/searchMovies?title=${encodeURIComponent(title)}&page=${page}`);
            if (!movieRes.ok) throw new Error(`Failed to search movies: ${movieRes.statusText}`);
            const moviesData = await movieRes.json();
            movies = moviesData.results;
        } catch (e) {
            console.error('Error searching movies:', e);
        } finally {
            isLoading = false; // Set loading to false after fetch (either success or error)
        }
    }

    async function fetchFilterSearch() {
        isLoading = true; // Set loading to true before fetch
        const genre = document.querySelector('#genre-id').value;
        const releaseYearStart = document.querySelector('#releaseStart').value;        
        const releaseYearEnd = document.querySelector('#releaseEnd').value;
        const rating = document.querySelector('#rating').value;

        try {
            const filterRes = await fetch(`/api/filterSearch?genre=${genre}&releaseYearStart=${releaseYearStart}&releaseYearEnd=${releaseYearEnd}&rating=${rating}`);
            if (!filterRes.ok) throw new Error(`Failed to fetch filtered search: ${filterRes.statusText}`);
            const filterData = await filterRes.json();
            movies = filterData.results;
        } catch (e) {
            console.error('Error fetching filtered search:', e);
        } finally {
            isLoading = false; // Set loading to false after fetch (either success or error)
        }
    }

    function handleGenreInput(event) {
        const selectedOption = Array.from(document.querySelector('#genre-list').options).find(option => option.value === event.target.value);
        if (selectedOption) {
            document.querySelector('#genre-id').value = selectedOption.getAttribute('data-id');
        }
    }

    function toggleSave(movieId) {
        if (savedMovies.has(movieId)) {
            savedMovies.delete(movieId);
        } else {
            savedMovies.add(movieId);
        }
    }

    function isSaved(movieId) {
        return savedMovies.has(movieId);
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

    {#if isLoading}
        <!-- Show loading animation -->
        <div class="loader-container">
            <div class="loader"></div>
        </div>
    {:else}
        <div bind:this={movieContainer} class="grid lg:grid-cols-5 grid-cols-2">
            {#each movies as movie (movie.id)}
                <MovieComponent
                    title={movie.title}
                    release_date={movie.release_date}
                    vote_average={movie.vote_average}
                    genre_ids={movie.genre_ids}
                    poster_path={movie.poster_path}
                    data={data}
                    on:click={() => toggleSave(movie.id)}
                />
            {/each}
        </div>
    {/if}
    <div id="intersector">Loading more...</div>
</div>

<style>
    .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px; /* Adjust based on your layout */
    }

    .loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
