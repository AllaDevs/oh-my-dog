<script lang="ts">
  import { AppointmentState } from '$lib/enums';
  import {
    appointmentReasonMapper,
    appointmentStateMapper,
    dayTimeMapper,
  } from '$lib/utils/mappers';
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
</script>

<svelte:head>
  <title>Mis Turnos</title>
</svelte:head>

<div
  class="flex flex-row space-between mt-10 mb-10 ml-12 mr-12 justify-between"
>
  <p class="text-3xl font-semibold text-gray-900">Listado de turnos</p>
  <a
    href="./appointment/request"
    class="btn rounded bg-teal-500 text-gray-100 p-2">Pedir turno</a
  >
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
              <td class="px-4 py-3">{te.AppointmentState(appointment.state)}</td
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
