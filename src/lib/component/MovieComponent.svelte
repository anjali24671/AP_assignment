<script>
    export let data 
    let save = true

</script>



<div class="flex flex-col gap-1 mx-4 my-3">
    <div class="w-[200px] h-[250px] relative bg-green-100 shadow-l-lg">
        <img class="w-full h-full object-cover" src="src\lib\static\radhe.png">
         <div class="w-[50px] h-[50px] absolute bottom-5 rounded-[50%] right-[-20px] flex items-center justify-center bg-yellow-100">
            5.9
         </div>
    </div>
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-lg mt-2">Title</h1>
            <h2>Action, drama</h2>
        </div>
        {#if !save}
            <button on:click={()=> save = !save}>Save</button> 
        {:else}
            <button on:click={()=> save = !save}>Remove</button>
        {/if}   
    </div>
  
    
</div>
