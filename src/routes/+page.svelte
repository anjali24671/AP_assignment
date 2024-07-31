
<script>
    import { onMount } from 'svelte';

    export let data 
    console.log(data.movieData)
    let movieContainer

    onMount(()=>{
        initialMovie(movieContainer)
    })


    function initialMovie(movieContainer){
        movieContainer.innerHTML = 'I am initial movie'
    }



</script>


<div class="flex items-center gap-5 justify-center flex-col">
    <h1 class="text-green-400">The Movie browser</h1>
    <div>
        <input placeholder="Search a movie..."> 
        <select>
            <option  selected disabled>Filter</option>
            <option >Genre</option>
            <option>Release year</option>
            <option>Rating</option>
        </select>
    </div>
    <div bind:this={movieContainer} class="grid lg:grid-cols-5 grid-cols-3 gap-2">

        
    </div>
</div>