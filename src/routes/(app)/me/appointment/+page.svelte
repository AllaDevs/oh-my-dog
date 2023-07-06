<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { AppointmentState } from '$lib/enums';
  import { prettyDate } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';

  export let data;

  const tableHeaders = [
    'Última modificación',
    'Día del turno',
    'Hora del turno',
    'Motivo',
    'Estado',
    'Perro',
    'Acción',
  ];

  function openConfirmation(e: Event, action: string) {
    let conf = window.confirm(`Está seguro que desea ${action} el turno?`);
    if (!conf) {
      e.preventDefault();
    }
  }
</script>

<svelte:head>
  <title>Mis Turnos</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="flex flex-row justify-between mb-7 mt-7">
    <h2 class=" mt-4 text-2xl">Mis turnos</h2>
    <div class="self-end">
      <A href="./appointment/request" color="primary" button>Pedir turno</A>
    </div>
  </div>
  {#if !data.clientAppointments || data.clientAppointments.length == 0}
    <p class="text-2xl font-semibold text-gray-900 text-center">
      No hay turnos para mostrar
    </p>
  {:else}
    <article class="px-4 py-2">
      <div class="relative overflow-x-auto">
        <table class="w-full text-sm text-left text-white-500 border">
          <thead class=" text-sm text-gray-100 uppercase bg-teal-900">
            <tr>
              {#each tableHeaders as header}
                <th
                  scope="row"
                  class="px-4 py-3 font-medium text-gray-100 whitespace-nowrap"
                  >{header}</th
                >
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each data.clientAppointments as appointment}
              <tr class="border-b bg-teal-100/75 hover:bg-teal-200">
                <td class="px-4 py-3">{prettyDate(appointment.createdAt)}</td>
                <td class="px-4 py-3">{prettyDate(appointment.date)}</td>
                <td class="px-4 py-3">{te.Daytime(appointment.daytime)}</td>
                <td class="px-4 py-3"
                  >{te.AppointmentReason(appointment.reason)}</td
                >
                <td class="px-4 py-3"
                  >{te.AppointmentState(appointment.state)}</td
                >
                <td class="px-4 py-3"
                  >{`${appointment.dog.name} - ${prettyDate(
                    appointment.dog.birthdate
                  )}`}</td
                >
                <td class=" px-4 py-3">
                  <div class=" min-w-max flex flex-row justify-left gap-2">
                    {#if appointment.state == AppointmentState.VET_REQUEST}
                      <form action="?/confirm" method="post">
                        <input
                          type="text"
                          name="appointmentId"
                          value={appointment.id}
                          class="hidden"
                        />
                        <button
                          type="submit"
                          class=" opacity-80 hover:underline underline-offset-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                          >Aceptar</button
                        >
                      </form>
                      <form action="?/reject" method="post">
                        <input
                          type="text"
                          name="appointmentId"
                          value={appointment.id}
                          class="hidden"
                        />
                        <button
                          type="submit"
                          class=" opacity-80 hover:underline underline-offset-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                          >Rechazar</button
                        >
                      </form>
                    {:else if appointment.state === AppointmentState.CONFIRMED}
                      <form
                        action="?/cancel"
                        method="post"
                        on:submit={(e) => openConfirmation(e, 'cancelar')}
                      >
                        <input
                          type="text"
                          name="appointmentId"
                          value={appointment.id}
                          class="hidden"
                        />
                        <button
                          type="submit"
                          class=" opacity-80 hover:underline underline-offset-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                          Cancelar
                        </button>
                      </form>
                    {:else}
                      <p>Sin acciones</p>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </article>
  {/if}
</Page>
