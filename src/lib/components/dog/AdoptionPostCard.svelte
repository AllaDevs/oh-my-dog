<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import type { RegisteredDog, TemporalDog } from '@prisma/client';

  export let postId: string;
  export let dog: TemporalDog | RegisteredDog;
  export let owned: boolean;
  export let resolved: boolean;

  const dogImageSrc =
    (owned ? dog.image?.url : undefined) ?? '/dog_silhouette.png';
</script>

<div
  class=" flex flex-col justify-between min-h-full transition-transform hover:scale-105 border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
>
  <img class="rounded-full w-24 h-24 mx-auto" src={dogImageSrc} alt="dog" />
  <h1 class="font-bold">
    {dog.name}
  </h1>
  {#if dog.observation}
    <p>
      {dog.observation}
    </p>
  {/if}
  <div class="self-end">
    {#if owned}
      <A href="/adoption/{postId}" color="primary" button>
        {resolved ? 'Ver' : 'Editar'}
      </A>
    {:else}
      <A href="/adoption/{postId}/contact" color="primary" button>Ver</A>
    {/if}
  </div>
</div>
