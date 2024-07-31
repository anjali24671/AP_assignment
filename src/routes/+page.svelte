
<script>
    import { onMount } from 'svelte';
    import MovieComponent from '../lib/component/MovieComponent.svelte';

    export let data 
    console.log(data.movieData)
    let movieContainer
    let showFilter = false

    onMount(()=>{
        initialMovie(movieContainer)
    })


    function initialMovie(movieContainer){
        
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
            <div class="absolute flex z-10 flex-col my-2 p-3 bg-red-400 w-full">
                
                <label>Genre</label>
                <input id="fruit" name="fruit" type="text" list="fruits" placeholder="Type">
                <datalist id="fruits">
                    <option value="Apple">
                    <option value="Banana">
                    <option value="Cherry">
                    <option value="Date">
                    <option value="Fig">
                    <option value="Grape">
                    <option value="Kiwi">
                    <option value="Lemon">
                    <option value="Mango">
                    <option value="Orange">
                  </datalist>

                <label>Release Year</label>
                <div class="flex w-[90%] gap-2">
                    <div >
                        <input class="w-[50px]" placeholder="From">
                    </div>
                    <div >
                        <input class="w-[50px]" placeholder="To">
                    </div>                    
                </div>

                <label>Rating</label>
                <!-- <div class="flex">
                    <div>
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="yellow">
                            <path d="M12 2.5l2.1 6.4h6.7l-5.4 3.9 2.1 6.4-5.4-3.9-5.4 3.9 2.1-6.4-5.4-3.9h6.7z"/>
                          </svg>
                          
                    </div>
                    <div>
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="yellow">
                            <path d="M12 2.5l2.1 6.4h6.7l-5.4 3.9 2.1 6.4-5.4-3.9-5.4 3.9 2.1-6.4-5.4-3.9h6.7z"/>
                          </svg>
                          
                    </div>
                    <div>
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="yellow">
                            <path d="M12 2.5l2.1 6.4h6.7l-5.4 3.9 2.1 6.4-5.4-3.9-5.4 3.9 2.1-6.4-5.4-3.9h6.7z"/>
                          </svg>
                          
                    </div>
                </div> -->
                <input>
              
               
            </div>
        {/if}
    </div>
 
    <div bind:this={movieContainer} class="grid lg:grid-cols-5 grid-cols-2 ">
        <MovieComponent/>
        <MovieComponent/>
        <MovieComponent/>
    </div>
   

</div>