<script lang="ts">
  import DogInfo from '$lib/components/client/DogInfo.svelte';

  import { te } from '$lib/utils/translateEnums.js';

  export let data;
</script>

<main id="main" class=" container mx-auto px-6 py-4">
  <header>
    <h2 class=" w-fit mt-4 text-2xl">Mi perro</h2>
  </header>
  <article class="px-4 py-2">
    <section>
      <DogInfo dog={data.dog} />
    </section>
    <section>
      <header>
        <h3 class=" text-xl mt-4 lg:mt-10">Historial medico de {data.dog.name}</h3>
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
            <p class="text-center text-lg font-semibold">
              Sin historial medico
            </p>
          </li>
        {/each}
      </ul>
    </section>
  </article>
</main>
