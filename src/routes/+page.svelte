<script>
    import { onMount, onDestroy } from 'svelte';
    import MovieComponent from '../lib/component/MovieComponent.svelte';
    import {goto} from '$app/navigation'
    export let data;

    let movieContainer;
    let intersector;
    let searchInput;
    let showFilter = false;
    let movies = [];

    let savedMovies = new Set(); // To keep track of saved movie IDs
    let isLoading = true; // State variable for loading
    let searchDropdown;
    let initialPage = 1; // Start from page 1 for initial movies
    let searchPage = 1; // Start from page 1 for search results
    let filterPage = 1; // Start from page 1 for filtered results
    let totalInitialPages = 10; // Track total number of pages for initial movies
    let totalSearchPages = 10; // Track total number of pages for search results
    let totalFilterPages = 5; // Track total number of pages for filtered results
    let isSearchMode = false; // To distinguish between initial fetch and search mode
    let isFilterMode = false; // To distinguish between initial fetch and filter mode

    // Reactive variables for filter inputs
    let genreId = '';
    let releaseStart = '';
    let releaseEnd = '';
    let rating = '';

    // Reactive variable for search query
    let searchQuery = '';
    let movieNames = []; // To store movie names for the dropdown
    let debounceTimeout;

    onMount(async () => {
        searchInput = document.querySelector('#search');
        intersector = document.querySelector('#intersector');
        searchDropdown = document.querySelector('#movie-names');
        await fetchInitialMovies(initialPage);

        // Setup Intersection Observer for infinite scrolling
        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                if (isSearchMode && searchPage < totalSearchPages) {
                    searchPage += 1;
                    await fetchSearchMovies(searchQuery, searchPage);
                } else if (isFilterMode && filterPage < totalFilterPages) {
                    filterPage += 1;
                    await fetchFilterSearch(filterPage);
                } else if (!isSearchMode && !isFilterMode && initialPage < totalInitialPages) {
                    initialPage += 1;
                    await fetchInitialMovies(initialPage);
                }
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        });

        observer.observe(intersector);

        // Add event listener to close dropdown when clicking outside
        function handleClickOutside(event) {
            if (searchDropdown && !searchDropdown.contains(event.target) && !searchInput.contains(event.target)) {
                movieNames = []; // Close the dropdown
            }
        }

        document.addEventListener('click', handleClickOutside);
        onDestroy(() => document.removeEventListener('click', handleClickOutside));
    });

    function showFilters() {
        showFilter = !showFilter;
    }

    async function fetchInitialMovies(page = 1) {
        isLoading = true; // Set loading to true before fetch

        try {
            const movieRes = await fetch(`/api/initialMovies?page=${page}`);
            if (!movieRes.ok) throw new Error(`Failed to fetch initial movies: ${movieRes.statusText}`);
            const moviesData = await movieRes.json();
            if (page === 1) {
                movies = moviesData.results;
            } else {
                movies = [...movies, ...moviesData.results]; // Append new movies
            }
            totalInitialPages = moviesData.total_pages; // Update total pages for initial movies
        } catch (e) {
            console.error('Error fetching initial movies:', e);
        } finally {
            isLoading = false; // Set loading to false after fetch (either success or error)
        }
    }

    async function fetchSearchMovies(title, page = 1) {
        if (page === 1) isLoading = true; // Set loading to true before fetch
        try {
            const movieRes = await fetch(`/api/searchMovies?title=${encodeURIComponent(title)}&page=${page}`);
            if (!movieRes.ok) throw new Error(`Failed to search movies: ${movieRes.statusText}`);
            const moviesData = await movieRes.json();
            if (page === 1) {
                movies = moviesData.results;
            } else {
                movies = [...movies, ...moviesData.results]; // Append new movies
            }
            totalSearchPages = moviesData.total_pages; // Update total pages for search results
        } catch (e) {
            console.error('Error searching movies:', e);
        } finally {
            isLoading = false; // Set loading to false after fetch (either success or error)
        }
    }

    async function fetchFilterSearch(page = 1) {
        if (page === 1) isLoading = true; // Set loading to true before fetch

        console.log(`Fetching filtered movies, genre: ${genreId}, releaseYearStart: ${releaseStart}, releaseYearEnd: ${releaseEnd}, rating: ${rating}, page: ${page}`);

        try {
            const filterRes = await fetch(`/api/filterSearch?genre=${genreId}&releaseYearStart=${releaseStart}&releaseYearEnd=${releaseEnd}&rating=${rating}&page=${page}`);
            if (!filterRes.ok) throw new Error(`Failed to fetch filtered search: ${filterRes.statusText}`);
            const filterData = await filterRes.json();
            if (page === 1) {
                movies = filterData.results;
            } else {
                movies = [...movies, ...filterData.results]; // Append new movies
            }
            totalFilterPages = filterData.total_pages; // Update total pages for filtered search results
        } catch (e) {
            console.error('Error fetching filtered search:', e);
        } finally {
            isLoading = false; // Set loading to false after fetch (either success or error)
        }
    }

    function handleGenreInput(event) {
        genreId = Array.from(document.querySelector('#genre-list').options).find(option => option.value === event.target.value)?.getAttribute('data-id') || '';
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

    function handleSearch() {
        searchPage = 1; // Reset search page
        isSearchMode = true; // Switch to search mode
        isFilterMode = false; // Disable filter mode
        fetchSearchMovies(searchQuery, searchPage);
    }

    function handleFilterSearch() {
        filterPage = 1; // Reset filter page
        isFilterMode = true; // Switch to filter mode
        isSearchMode = false; // Disable search mode
        fetchFilterSearch(filterPage);
        showFilters(); // Close the filter menu
    }

    function selectMovieName(name) {
        searchQuery = name;
        movieNames = []; // Clear the list after selection
    }

    // Debounce function
    function debounce(fn, delay) {
        return function(...args) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // Handle changes to searchQuery with debouncing
    $: {
        const searchQueryDebounced = debounce(async (query) => {
            if (query.trim() !== '') {
                console.log(`Making API request with searchQuery: ${query}`);
                try {
                    const response = await fetch(`/api/searchMovies?title=${encodeURIComponent(query)}`);
                    const data = await response.json();
                    
                    // Extract and store the names of the movies (limit to top 5)
                    movieNames = data.results.slice(0, 5).map(movie => movie.title);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            } else {
                movieNames = []; // Clear movie names if search query is empty
            }
        }, 500); // Debounce delay of 500ms

        searchQueryDebounced(searchQuery);
    }
</script>

<div class="container">
    <header class="header  ">
        <h1 class="title">The Movie Browser</h1>
        <div class="flex min-w-[100vw]  items-center justify-center gap-4">
            <div class="search-bar">
                <div class="search-button  md:hidden ">Saved Movies</div>
                <input id="search" placeholder="Search a movie..." bind:value={searchQuery} list="movie-names" class="search-input">
                <datalist id="movie-names">
                    {#each movieNames as name}
                        <option value={name}></option>
                    {/each}
                </datalist>
                <button class="search-button" on:click={handleSearch}>Search</button>
                <button class="filter-button" on:click={showFilters}>Filter</button>
            </div>
            <div class="search-button hidden md:block md:absolute right-2 "><button on:click={()=>goto('/saved_movies')}>Saved Movies</button></div>
        </div>
        
        
    </header>
    
    {#if showFilter}
        <div class="filter-menu">       
            <label>Genre</label>
            <input id="genre" placeholder="Search genres..." list="genre-list" on:input={handleGenreInput} class="filter-input">
            <datalist id="genre-list">
                {#each data.genre as genre}
                    <option value={genre.name} data-id={genre.id}></option>
                {/each}
            </datalist>

            <label>Release Date</label>
            <div class="date-range">
                <input id="releaseStart" type="date" bind:value={releaseStart} class="date-input" />
                <input id="releaseEnd" type="date" bind:value={releaseEnd} class="date-input" />
            </div>

            <label>Rating</label>
            <input id="rating" type="number" min="0" max="10" step="0.1" bind:value={rating} class="filter-input">

            <button class="filter-button" on:click={handleFilterSearch}>Apply Filters</button>
        </div>
    {/if}

    {#if isLoading && initialPage === 1}
        <!-- Show loading animation -->
        <div class="loader-container">
            <div class="loader"></div>
        </div>
    {:else}
        <div bind:this={movieContainer} class="movie-grid">
            {#each movies as movie (movie.id)}
                <MovieComponent
                    title={movie.title}
                    release_date={movie.release_date}
                    vote_average={movie.vote_average}
                    genre_ids={movie.genre_ids}
                    poster_path={movie.poster_path}
                    data={movie}
                    genre_list={data.genre}
                    on:click={() => toggleSave(movie.id)}
                    class="movie-item"
                />
            {/each}
        </div>
    {/if}

    {#if (isSearchMode && searchPage < totalSearchPages) || (isFilterMode && filterPage < totalFilterPages) || (!isSearchMode && !isFilterMode && initialPage < totalInitialPages)}
        <div id="intersector" class="loading-more">Loading more...</div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        min-width:100vw;
        background-color: #f0f0f0;
    }

    .header {
        text-align: center;
        margin-bottom: 20px;
    }

    .title {
        font-size: 2rem;
        color: #333;
        margin-bottom: 10px;
    }

    .search-bar {
        display: flex;
        gap: 10px;
       
        align-items: center;
    }

    .search-input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 300px;
    }

    .search-button,
    .filter-button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
    }

    .filter-button {
        background-color: #28a745;
    }

    .search-button:hover,
    .filter-button:hover {
        opacity: 0.9;
    }

    .filter-menu {
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: white;
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 10;
        
    }

    .filter-input,
    .date-input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 100%;
        margin-bottom: 10px;
    }

    .date-range {
        display: flex;
        gap: 10px;
    }

    .movie-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1200px;
    }

    .movie-item {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
    }

    .movie-item:hover {
        transform: scale(1.02);
    }

    .movie-item img {
        width: 100%;
        height: auto;
        object-fit: cover;
        max-height: 300px; /* Ensure the image doesn't exceed the container height */
    }

    .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
    }

    .loader {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #007bff;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .loading-more {
        font-size: 1.2rem;
        color: #007bff;
        text-align: center;
        margin: 20px 0;
    }
</style>
