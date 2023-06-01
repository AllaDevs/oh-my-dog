<script lang="ts">
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  import ClientUpdateForm from '$lib/components/client/ClientUpdateForm.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Perro para adopción registrado con exito');
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });
</script>

<svelte:head>
  <title>Administrar cliente</title>
</svelte:head>

<main
  id="main"
  class="container mx-auto flex max-w-screen-lg flex-col px-6 py-4 pb-8"
>
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-2xl">Administrar cliente</h2>
  </header>

  <article class="flex flex-col gap-8 px-4 justify-around lg:flex-row">
    <section class="grid">
      <form method="POST" action="?/update" use:updateSForm.enhance class=" my-auto">
        <ClientUpdateForm sForm={updateSForm} >
          <svelte:fragment slot="title">
            <h3 class=" text-lg font-semibold text-gray-900">
              Informacion del cliente
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="actions">
            <button
              type="button"
              on:click={() => updateSForm.reset()}
              class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            >
              Cancelar
            </button>
            <SubmitButton>Actualizar</SubmitButton>
          </svelte:fragment>
        </ClientUpdateForm>
      </form>
    </section>
    <section class="flex flex-col gap-4">
      <div class="flex justify-between">
        <h3 class=" text-lg font-semibold text-gray-900">
          Perros del cliente
        </h3>
        <a href="/vet/client/{data.client.id}/new_dog" class=" hover:underline underline-offset-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ">
          Nuevo perro
        </a>
      </div>
      <ul class="grid gap-4 justify-center">
        {#each data.client.dog as dog (dog.id)}
          <li>
            <div
              class=" flex justify-around min-h-full transition-transform hover:scale-105 border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
            >
              <img
                class="rounded-full w-24 h-24"
                src={dog.image?.url ?? '/dog_silhouette.png'}
                alt="dog"
              />
              <div class=" flex flex-col justify-around">
                <h1 class="font-bold">
                  {dog.name}
                </h1>
                {#if dog.observation}
                  <p>
                    {dog.observation}
                  </p>
                {/if}
                <a
                  href="/vet/client/{data.client.id}/dog/{dog.id}"
                  class="btn variant-filled btn-sm"
                >
                  Ver
                </a>
              </div>
            </div>
          </li>
        {:else}
          <li>
            <p class=" text-gray-700">El cliente no tiene perros registrados</p>
          </li>
        {/each}
      </ul>
    </section>
  </article>
</main>
