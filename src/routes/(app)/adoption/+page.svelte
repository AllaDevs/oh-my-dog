<script lang="ts">
  import AdoptionPostCard from '$lib/components/dog/AdoptionPostCard.svelte';
  export let data;
</script>

<svelte:head>
  <title>Adopcion</title>
</svelte:head>

<main
  id="main"
  class="container mx-auto flex max-w-screen-lg flex-col px-6 py-4"
>
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-2xl">Perros para adoptar</h2>
    <a href="/adoption/new_post" class="btn variant-filled btn-sm">
      Dar en adopcion
    </a>
  </header>

  <article class="table-container table-interactive px-4 py-2">
    <ul class="flex gap-5 flex-col">
      {#each data.posts as post (post.id)}
        {@const dog = post.registered ? post.registeredDog : post.temporalDog}
        <li>
          <AdoptionPostCard postId={post.id} {dog} />
        </li>
      {/each}
    </ul>
  </article>
</main>
