<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import AdoptionPostCard from '$lib/components/dog/AdoptionPostCard.svelte';
  import DropdownMenu from '$lib/components/dropdown/DropdownMenu.svelte';
  import DropdownMenuItem from '$lib/components/dropdown/DropdownMenuItem.svelte';
  import { DogSex, DogSize, PostState } from '$lib/enums.js';
  import { breedsToInputOptions } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';

  export let data;

  const breeds = breedsToInputOptions(data.breeds);
  const posts = [...data.posts];

  let visiblePosts: typeof posts;

  let filterOwned = false;
  let filterBreed = '';
  let filterSize = '';
  let filterSex = '';
  let filterState: PostState | 'all' | '' = PostState.WAITING;
  let sortByAge: 'desc' | 'asc' | '' = '';

  function resetFilters() {
    filterOwned = false;
    filterBreed = '';
    filterSize = '';
    filterSex = '';
    filterState = PostState.WAITING;
    sortByAge = '';
  }

  $: {
    visiblePosts = posts.filter((post) => {
      return (
        (!filterOwned || post.publisherId === data.user?.userId) &&
        (!filterBreed || post.dog.breedId === filterBreed) &&
        (!filterSize || post.dog.size === filterSize) &&
        (!filterSex || post.dog.sex === filterSex) &&
        ((!filterState && post.state === PostState.WAITING) ||
          filterState === 'all' ||
          post.state === filterState)
      );
    });
  }

  $: {
    switch (sortByAge) {
      case 'desc': {
        visiblePosts.sort(
          (postA, postB) =>
            postA.dog.birthdate.getTime() - postB.dog.birthdate.getTime()
        );
        break;
      }
      case 'asc': {
        visiblePosts.sort(
          (postA, postB) =>
            postB.dog.birthdate.getTime() - postA.dog.birthdate.getTime()
        );
        break;
      }
      default: {
        visiblePosts.sort(
          (postA, postB) =>
            postB.createdAt.getTime() - postA.createdAt.getTime()
        );
        break;
      }
    }
    visiblePosts = visiblePosts;
  }
</script>

<svelte:head>
  <title>Adopcion</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg p-4"
  classHeaderSlot="mt-2"
  classContentSlot="mt-2 px-4 overflow-y-hidden"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-3xl">Perros para adoptar</h2>
  </svelte:fragment>

  <section class=" flex flex-col gap-4 max-h-full">
    <div class=" flex justify-between items-end">
      <h3 class=" mt-4 text-xl font-bold">Publicaciones</h3>
      <div class="flex gap-4">
        {#if data.client}
          <a
            href="/adoption/new_post"
            class=" hover:underline underline-offset-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Dar en adopcion
          </a>
        {/if}
        <DropdownMenu label="Filtrar">
          <svelte:fragment slot="items">
            <DropdownMenuItem class=" flex flex-col">
              <label for="breed">Raza</label>
              <select
                name=""
                id="breed"
                bind:value={filterBreed}
                class="w-max mt-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              >
                <option value="" />
                {#each breeds as breed}
                  <option value={breed.value}>{breed.text}</option>
                {/each}
              </select>
            </DropdownMenuItem>
            <DropdownMenuItem class=" flex flex-col">
              <label for="size">Tamaño</label>
              <select
                name=""
                id="size"
                bind:value={filterSize}
                class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              >
                <option value="" />
                <option value={DogSize.SMALL}
                  >{te.DogSize(DogSize.SMALL)}</option
                >
                <option value={DogSize.MEDIUM}
                  >{te.DogSize(DogSize.MEDIUM)}</option
                >
                <option value={DogSize.BIG}>{te.DogSize(DogSize.BIG)}</option>
              </select>
            </DropdownMenuItem>
            <DropdownMenuItem class=" flex flex-col">
              <label for="age">Edad</label>
              <select
                name=""
                id="age"
                bind:value={sortByAge}
                class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              >
                <option value="" />
                <option value="desc">Descensente</option>
                <option value="asc">Ascendente</option>
              </select>
            </DropdownMenuItem>
            <DropdownMenuItem class=" flex flex-col">
              <label for="sex">Sexo</label>
              <select
                name=""
                id="sex"
                bind:value={filterSex}
                class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              >
                <option value="" />
                <option value={DogSex.FEMALE}>{te.DogSex(DogSex.FEMALE)}</option
                >
                <option value={DogSex.MALE}>{te.DogSex(DogSex.MALE)}</option>
              </select>
            </DropdownMenuItem>
            <span class="border-b my-2 border-gray-400" />
            {#if data.client}
              <DropdownMenuItem class=" flex gap-2 items-center">
                <label for="owned">Publicaciones propias</label>
                <input
                  type="checkbox"
                  name=""
                  id="owned"
                  bind:checked={filterOwned}
                />
              </DropdownMenuItem>
            {/if}
            <DropdownMenuItem class=" flex flex-col">
              <label for="state">Estado de la publicacion</label>
              <select
                name=""
                id="state"
                bind:value={filterState}
                class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              >
                <option value="" />
                <option value={PostState.RESOLVED}>Resuelta</option>
                <option value={PostState.WAITING}>Buscando dueño/a</option>
                <option value="all">Todas</option>
              </select>
            </DropdownMenuItem>
            <!-- <span class="border-b my-2 border-gray-400" /> -->
            <DropdownMenuItem class=" mt-4">
              <button
                on:click={resetFilters}
                class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Resetear los filtros
              </button>
            </DropdownMenuItem>
          </svelte:fragment>
        </DropdownMenu>
      </div>
    </div>
    <ul class=" grid gap-4 lg:grid-cols-2 overflow-y-auto scrollbar p-4">
      {#each visiblePosts as post (post.id)}
        <li
          animate:flip|local={{ duration: 500 }}
          transition:fade|local={{ duration: 100 }}
        >
          <AdoptionPostCard
            postId={post.id}
            dog={post.dog}
            owned={post.publisherId === data.client?.id}
            resolved={post.state === PostState.RESOLVED}
          />
        </li>
      {:else}
        <li>
          <p>No hay publicacion de adopcion para mostrar</p>
        </li>
      {/each}
    </ul>
  </section>
</Page>
