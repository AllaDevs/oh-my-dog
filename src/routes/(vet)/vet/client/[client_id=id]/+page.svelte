<script lang="ts">
  import ClientUpdateForm from '$cmp/client/ClientUpdateForm.svelte';
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { DonationReason } from '$lib/enums';
  import { friendlyDate, prettyDate } from '$lib/utils/functions';
  import { te } from '$lib/utils/translateEnums';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cliente actualizado con exito');
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
  classContainer="container mx-auto max-w-screen-lg px-6 pt-4 pb-8 scrollbar"
  classContentSlot="grid gap-8 p-4 justify-around lg:grid-cols-2"
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
          <A href="/vet/appointment/{data.client.id}" color="primary" button>
            Ver turnos
          </A>
        </svelte:fragment>

        <svelte:fragment slot="actions">
          <Button on:click={() => updateSForm.reset()}>Restaurar</Button>
          <Button type="submit" color="primary">Actualizar</Button>
        </svelte:fragment>
      </ClientUpdateForm>
    </form>
  </section>

  <section class="flex flex-col gap-4">
    <div class="flex justify-between">
      <h3 class=" text-lg font-semibold text-gray-900">Perros del cliente</h3>
      <A href="/vet/client/{data.client.id}/dog/new" color="primary" button>
        Nuevo perro
      </A>
    </div>
    <ul class="grid gap-4 justify-center">
      {#each data.client.dog as dog (dog.id)}
        <li>
          <div
            class=" max-w-[24rem] flex gap-4 min-h-full transition-transform hover:scale-105 border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
          >
            <img
              class="rounded-full object-cover w-24 h-24 min-w-[6rem] min-h-[6rem] my-auto"
              src={dog.image?.url ?? '/dog_silhouette.png'}
              alt="dog"
            />
            <div class=" flex flex-col justify-around gap-2">
              <h4 class="font-bold">
                {dog.name}
              </h4>
              <p class="break-all line-clamp-2">
                Nacido el {prettyDate(dog.birthdate)}
              </p>
              <A
                href="/vet/client/{data.client.id}/dog/{dog.id}"
                color="primary"
                button
                class=" w-max"
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
      {#if data.client.dog.length}
        <li class="flex justify-around mt-4">
          <A
            href="/api/pdf/client/{data.client.id}"
            type="application/pdf"
            target="_blank"
            color="primary"
            button
          >
            Descargar historiales medicos
          </A>
        </li>
      {/if}
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
                Fecha: {friendlyDate(donation.createdAt)}
              </p>
              <p>
                Motivo: {te.DonationReason(donation.reason)}
              </p>
              {#if donation.reason === DonationReason.CAMPAIGN}
                <A
                  href="/vet/donation/campaign/{donation.campaingId}"
                  color="primary"
                  button
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
