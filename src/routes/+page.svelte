
<script>
    import { onMount } from 'svelte';

    export let data 
    console.log(data.movieData)
    let movieContainer
    let showFilter = false

    onMount(()=>{
        initialMovie(movieContainer)
    })


    function initialMovie(movieContainer){
        movieContainer.innerHTML = 'I am initial movie'
    }

    function showFilters(){
        showFilter =!showFilter
        if(showFilter){
            console.log('showing filters')
        }
    }



</script>


<div class="flex items-center gap-5 justify-center flex-col">
    <h1 class="text-green-400">The Movie browser</h1>
    <div class="relative">
        <input placeholder="Search a movie..."> 
        <button on:click={showFilters}>Filter</button>
        {#if showFilter}
            <div class="absolute flex flex-col my-2 p-3 bg-red-400 w-full">
                <label>Genre</label>
                <select>
                    <option>genre1</option>
                    <option>genre2</option>
                    <option>genre3</option>
                    <option>genre4</option>
                </select>

                <label>Release Year</label>
                <div class="flex w-[90%] gap-2">
                    <div >
                        <input class="w-[50px]" placeholder="From">
                    </div>
                    <div >
                        <input class="w-[50px]" placeholder="To">
                    </div>
                    
                    
                </div>
               
            </div>
        {/if}
    </div>
 
    <div bind:this={movieContainer} class="grid lg:grid-cols-5 grid-cols-3 gap-2">

        
    </div>
</div>