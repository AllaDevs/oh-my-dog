<script lang="ts">
  import ClientInfo from '$cmp/client/ClientInfo.svelte';
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { DonationReason } from '$lib/enums.js';
  import { te } from '$lib/utils/translateEnums.js';

  export let data;
</script>

<svelte:head>
  <title>Mi cuenta</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 scrollbar"
  classContentSlot="grid gap-8 p-4 justify-around lg:grid-cols-2"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Mi cuenta</h2>
  </svelte:fragment>

  <section>
    <ClientInfo client={data.me} title="Informacion personal">
      <svelte:fragment slot="actions">
        <A href="/me/account" color="primary" button>Editar cuenta</A>
      </svelte:fragment>
    </ClientInfo>
  </section>

  <section>
    <h3 class=" text-xl mt-4">Mis perros</h3>
    <ul
      class=" mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1 xl:grid-cols-2"
    >
      {#each data.dogs as dog}
        <li
          class=" flex min-h-full transition-transform hover:scale-105 justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
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
            <A href="/me/dog/{dog.id}" color="primary" button>Ver perfil</A>
            <A
              href="/me/appointment/request?dog_id={dog.id}"
              color="primary"
              button
            >
              Solicitar turno
            </A>
          </div>
        </li>
      {:else}
        <li
          class=" opacity-75 flex min-h-full justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
        >
          <p class="text-center text-base font-semibold">
            No tenés perros registrados
          </p>
        </li>
      {/each}
      {#if data.dogs.length}
        <li class=" mx-auto mt-4">
          <A
            href="/api/pdf/client/{data.me.id}"
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
      <h3 class=" text-lg font-semibold text-gray-900">Mis donaciones</h3>
    </div>
    <ul class="grid gap-4 justify-center">
      {#each data.donations as donation (donation.id)}
        <li>
          <div
            class=" flex justify-around min-h-full transition-transform hover:scale-105 border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50 flex-grow bg-teal-100 rounded-lg w-96"
          >
            <div class=" flex flex-col justify-around">
              <h4 class="font-bold">
                Monto: {donation.amount}
              </h4>
              <p>
                Fecha: {donation.createdAt.toLocaleString()}
              </p>
              <p>
                Motivo: {te.DonationReason(donation.reason)}
              </p>
              {#if donation.reason === DonationReason.CAMPAIGN}
                <A
                  href="/donation/campaign/{donation.campaingId}"
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
          <p class=" text-gray-700">No has realizado ninguna donacion</p>
        </li>
      {/each}
    </ul>
  </section>
</Page>
