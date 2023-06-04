<script lang="ts">
  import type { TemporalDog, RegisteredDog } from '@prisma/client';
  
  export let postId : string;
  export let dog: TemporalDog | RegisteredDog;
  export let owned: boolean;

  const dogImageSrc= (owned? dog.image?.url : undefined) ?? '/dog_silhouette.png';
</script>

<div class=" min-h-full transition-transform hover:scale-105 justify-around border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96">
  <img
    class="rounded-full w-24 h-24 mx-auto"
    src={dogImageSrc}
    alt="dog"
  />
  <h1 class="font-bold">
    {dog.name}
  </h1>
  {#if dog.observation}
    <p>
      {dog.observation}
    </p> 
  {/if}
  {#if owned}
    <a href={`/adoption/${postId}`} class="btn variant-filled btn-sm">
      Editar
    </a>
  {:else}
    <a href={`/adoption/${postId}/contact`} class="btn variant-filled btn-sm">
      Ver
    </a>
  {/if}
</div>
