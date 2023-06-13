<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import ClientUpdateForm from '$lib/components/client/ClientUpdateForm.svelte';
  import A from '$lib/components/element/A.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import { DonationReason } from '$lib/enums';
  import { te } from '$lib/utils/translateEnums.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

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

<Page
  classContainer="container mx-auto max-w-screen-lg px-6 pt-4 pb-8"
  classContentSlot="grid gap-8 px-4 justify-around lg:grid-cols-2"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Administrar cliente</h2>
  </svelte:fragment>

  <section class="flex flex-col">
    <form
      method="POST"
      action="?/update"
      use:updateSForm.enhance
      class=" my-auto"
    >
      <ClientUpdateForm sForm={updateSForm}>
        <svelte:fragment slot="title">
          <h3 class=" text-lg font-semibold text-gray-900">
            Informacion del cliente
          </h3>
          <a
            href="/vet/appointment/{data.client.id}"
            class=" hover:underline underline-offset-2 whitespace-nowrap rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Ver turnos
          </a>
        </svelte:fragment>
        <svelte:fragment slot="actions">
          <button
            type="button"
            on:click={() => updateSForm.reset()}
            class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
          >
            Restaurar
          </button>
          <SubmitButton>Actualizar</SubmitButton>
        </svelte:fragment>
      </ClientUpdateForm>
    </form>
  </section>

  <section class="flex flex-col gap-4">
    <div class="flex justify-between">
      <h3 class=" text-lg font-semibold text-gray-900">Perros del cliente</h3>
      <a
        href="/vet/client/{data.client.id}/dog/new"
        class=" hover:underline underline-offset-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
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
              <h4 class="font-bold">
                {dog.name}
              </h4>
              {#if dog.observation}
                <p>
                  {dog.observation}
                </p>
              {/if}
              <A
                href="/vet/client/{data.client.id}/dog/{dog.id}"
                color="teal"
                intensity={600}
                opacity={80}
              >
                Ver perfil
              </A>
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

  <section class="flex flex-col gap-4">
    <div class="flex justify-between">
      <h3 class=" text-lg font-semibold text-gray-900">
        Donaciones del cliente
      </h3>
    </div>
    <ul class="grid gap-4 justify-center">
      {#each data.client.donation as donation (donation.id)}
        <li>
          <div
            class=" flex justify-around min-h-full transition-transform hover:scale-105 border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
          >
            <div class=" flex flex-col justify-around">
              <h4 class="font-bold">
                Monto: {donation.amount}
              </h4>
              <p>
                Fecha: {donation.createdAt.toString()}
              </p>
              <p>
                Motivo: {te.DonationReason(donation.reason)}
              </p>
              {#if donation.reason === DonationReason.CAMPAIGN}
                <A
                  href="/vet/campaign/{donation.campaingId}"
                  color="teal"
                  intensity={600}
                  opacity={80}
                >
                  Ver campaña
                </A>
              {/if}
            </div>
          </div>
        </li>
      {:else}
        <li>
          <p class=" text-gray-700">El cliente no realizo donaciones</p>
        </li>
      {/each}
    </ul>
  </section>
</Page>
