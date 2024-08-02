<script>
    export let data 
    export let title;
    export let release_date
    export let vote_average
    export let genre_ids
    export let poster_path
    let base_url = 'https://image.tmdb.org/t/p/w500'
    let poster = base_url + poster_path

    console.log(poster)
   
    let save = true

</script>



<div class="flex flex-col gap-1 mx-4 my-3">
    <div class="w-[200px] h-[250px] relative bg-green-100 shadow-l-lg">
        <img class="w-full h-full object-cover" src={poster}>
         <div class="w-[50px] h-[50px] absolute bottom-5 rounded-[50%] right-[-20px] flex items-center justify-center bg-yellow-100">
            {vote_average}
         </div>
    </div>
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-lg mt-2">{title}</h1>
            <h2>Action, drama</h2>
        </div>
        {#if !save}
            <button on:click={()=> save = !save}>Save</button> 
        {:else}
            <button on:click={()=> save = !save}>Remove</button>
        {/if}   
    </div>
  
    
</div>
