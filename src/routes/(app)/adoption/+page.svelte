<script lang="ts">
  import Button from '$lib/components/element/Button.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';
  export let data;
</script>

<main id="main" class=" container mx-auto">
  <div class="flex">
    <div class="h-full">
      <h1 class="mt-4 mb-4 text-3xl font-bold pb-0 flex">Adopción</h1>
      <div class="max-w-sm">
        <div>
          <Button
            ><a href="/adoption/dogs_for_adoption">Dar en adopción mi perro</a
            ></Button
          >
        </div>
        <div class="pt-1">
          <Button><a href="/adoption/register_dog">Otro perro</a></Button>
        </div>
      </div>
    </div>
    <section class="pl-60 pt-5 space-y-4">
      <div>
        <ul class="flex gap-5 flex-col">
          {#each data.adoptionPosts as post}
            <li
              class="min-h-full transition-transform hover:scale-105 justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
            >
              <div class="">
                <img
                  class="rounded-full w-24 h-24 mx-auto"
                  src={post.tempDog?.image?.url ?? post.dog?.image?.url ?? '/dog_silhouette.png'}
                  alt="dog"
                />
                <h1 class="font-bold">
                  {post.dog?.name ?? post.tempDog?.name}
                </h1>
                <p>
                  {post.dog?.observation ?? post.tempDog?.observation}
                </p>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </section>
  </div>
</main>
