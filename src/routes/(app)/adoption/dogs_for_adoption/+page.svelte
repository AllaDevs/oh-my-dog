<script lang="ts">
  import Button from '$lib/components/element/Button.svelte';
    import toast from 'svelte-french-toast';
    import { superForm } from 'sveltekit-superforms/client';

  export let data;
  let dogs: typeof data.dogs = [];
  for (const dog of data.dogs) {
    if (!dog.archived) {
      dogs.push(dog);
    }
  }

</script>

<main id="main">
  <div>
    <Button
      ><a href="/adoption/register_dog">Dar en adopcion otro perro</a></Button
    >
  </div>
  <section>
    <ul
      class=" mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3"
    >
      {#each dogs as dog}
        <li
          class="min-h-full transition-transform hover:scale-105 justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
        >
          <div class=" flex flex-col">
            {#if dog.image}
              <img
                src={dog.image.url}
                alt="Foto de {dog.name}"
                class="rounded-full w-24 h-24 mx-auto"
              />
            {/if}
            <p class="text-center text-lg font-semibold">{dog.name}</p>
          </div>
          <div class=" flex flex-col justify-around">
            <form
              method="POST"
              action="?/myDog"
            >
              <input type="hidden" name="dogId" value={dog.id} />
              <button
                class=" underline-offset-2 hover:underline rounded-md text-center bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Dar en adopción
              </button>
            </form>
          </div>
        </li>
      {:else}
        <li
          class=" opacity-75 flex min-h-full justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
        >
          <p class="text-center text-lg font-semibold">
            No tenés perros para dar en adopción
          </p>
        </li>
      {/each}
    </ul>
  </section>
</main>
