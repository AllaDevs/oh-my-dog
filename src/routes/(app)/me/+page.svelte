<script lang="ts">
  import AccountInfo from '$lib/components/client/AccountInfo.svelte';
  import { AppointmentState } from '$lib/enums';
  import { te } from '$lib/utils/translateEnums.js';

  export let data;
</script>

<main id="main" class=" container mx-auto px-6 py-4">
  <header>
    <h2 class=" mt-4 text-2xl">Mi cuenta</h2>
  </header>
  <article class="px-4 py-2">
    <section>
      <AccountInfo client={{ ...data.me }} />
    </section>
    <section>
      <h3 class=" text-xl mt-4 lg:mt-10">Mis perros</h3>
      <ul
        class=" mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3"
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
              <a
                href="/me/dog/{dog.id}"
                class=" underline-offset-2 hover:underline rounded-md text-center bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Ver perfil
              </a>
              <a
                href="/appointment/new/{dog.id}"
                class=" underline-offset-2 hover:underline rounded-md text-center bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Solicitar turno
              </a>
            </div>
          </li>
        {:else}
          <li
            class=" flex min-h-full transition-transform hover:scale-105 justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
          >
            <p class="text-center text-lg font-semibold">
              No tenés perros registrados
            </p>
          </li>
        {/each}
      </ul>
    </section>
    <section>
      <header>
        <h3 class=" text-xl mt-4 lg:mt-10">Mis turnos</h3>
      </header>
      <ul
        class=" mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3"
      >
        {#each data.appointments as appointment}
          <li
            class=" flex min-h-full transition-transform hover:scale-105 justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
          >
            <div class=" flex flex-col">
              <p class="text-center text-lg font-semibold">
                Turno para {appointment.dog.name}
              </p>
              <p class="text-center text-lg font-semibold">
                Fecha: {appointment.date}
              </p>
              <p class="text-center text-lg font-semibold">
                Hora: {te.Daytime(appointment.daytime)}
              </p>
              <p class="text-center text-lg font-semibold">
                Estado: {te.AppointmentState(appointment.state)}
              </p>
              <p class="text-center text-lg font-semibold">
                Motivo: {te.AppointmentReason(appointment.reason)}
              </p>
            </div>
            <div class=" flex flex-col justify-around">
              {#if appointment.state === AppointmentState.CONFIRMED}
                <a
                  href="/appointment/cancel/{appointment.id}"
                  class=" underline-offset-2 hover:underline rounded-md text-center bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Cancelar turno
                </a>
              {/if}
              <a
                href="/appointment/{appointment.id}"
                class=" underline-offset-2 hover:underline rounded-md text-center bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Ver turno
              </a>
            </div>
          </li>
        {:else}
          <li
            class=" opacity-75 flex min-h-full justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
          >
            <p class="text-center text-lg font-semibold">
              No tenés turnos registrados
            </p>
          </li>
        {/each}
      </ul>
    </section>
  </article>
</main>
