<script lang="ts">
  import AdoptionPostCard from '$lib/components/dog/AdoptionPostCard.svelte';
  import { PostState } from '$lib/enums.js';

  export let data;

  let posts: typeof data.posts = [];
  for (const post of data.posts) {
    if (post.state === PostState.RESOLVED) {
      continue;
    }
    posts.push(post);
  }
</script>

<svelte:head>
  <title>Adopcion</title>
</svelte:head>

<main
  id="main"
  class="container mx-auto flex max-w-screen-lg flex-col px-6 py-4"
>
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-3xl">Perros para adoptar</h2>
  </header>

  <article class=" flex flex-col gap-8 px-4 justify-around">
    <section class=" flex flex-col gap-4">
      <div class=" flex justify-between items-end">
        <h3 class=" mt-4 text-xl font-bold">Perros en adopcion</h3>
        {#if data.client}
          <a
            href="/adoption/new_post"
            class=" hover:underline underline-offset-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Dar en adopcion
          </a>
        {/if}
      </div>
      <ul class=" grid gap-4 md:grid-cols-2">
        {#each posts as post (post.id)}
          <li>
            <AdoptionPostCard
              postId={post.id}
              dog={post.dog}
              owned={post.publisherId === data.client?.id}
            />
          </li>
        {:else}
          <li>
            <p>No hay publicacion de adopcion para mostrar</p>
          </li>
        {/each}
      </ul>
    </section>
  </article>
</main>
