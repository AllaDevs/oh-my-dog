<script lang="ts">
  import DogInfo from '$cmp/client/DogInfo.svelte';
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { te } from '$lib/utils/translateEnums.js';

  export let data;
</script>

<svelte:head>
  <title>Mi cuenta</title>
</svelte:head>

<Page classContainer="container mx-auto px-6 py-4" classContentSlot="px-4 py-2">
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Perfil de {data.dog.name}</h2>
  </svelte:fragment>

  <section>
    <DogInfo dog={data.dog} title="Informacion" />
  </section>

  <section>
    <header class="flex justify-between">
      <h3 class=" text-xl mt-4 lg:mt-10">
        Historial medico de {data.dog.name}
      </h3>
      <div class="self-end mb-1">
        <A
          href="/api/pdf/dog/{data.dog.id}"
          type="application/pdf"
          target="_blank"
          color="primary"
          button
        >
          Descargar PDF
        </A>
      </div>
    </header>
    <ul
      class=" mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3"
    >
      {#each data.dog.medicalRecord as medicalRecord}
        <li
          class=" flex min-h-full transition-transform hover:scale-105 justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
        >
          <div class=" flex flex-col">
            <p class="text-center text-lg font-semibold">
              Motivo: {te.AppointmentReason(medicalRecord.reason)}
            </p>
            <p class="text-center text-lg font-semibold">
              Fecha: {medicalRecord.date}
            </p>
            <p class="text-center text-lg font-semibold">
              Observacion: {medicalRecord.observation ??
                'Sin observacion de la consulta'}
            </p>
          </div>
        </li>
      {:else}
        <li
          class=" opacity-75 flex min-h-full justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
        >
          <p class="text-center text-lg font-semibold">Sin historial medico</p>
        </li>
      {/each}
    </ul>
  </section>
</Page>
