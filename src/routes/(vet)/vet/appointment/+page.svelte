<script lang="ts">
  import { AppointmentState } from '$lib/enums';
  import {
    appointmentReasonMapper,
    appointmentStateMapper,
    dayTimeMapper,
  } from '$lib/utils/mappers';
  export let data;

  const tableHeaders = [
    'Número de turno',
    'Pedido en',
    'Cliente',
    'Día del turno',
    'Hora del turno',
    'Motivo',
    'Estado',
    'Perro',
    'Acción',
  ];
</script>

<svelte:head>
  <title>Turnos</title>
</svelte:head>

<div
  class="flex flex-row space-between mt-10 mb-10 ml-12 mr-12 justify-between"
>
  <p class="text-3xl font-semibold text-gray-900">Listado de turnos</p>
  <a href="/vet/appointment" class="btn variant-filled btn-sm">Filtrar</a>
</div>
{#if !data.appointments || data.appointments.length == 0}
  <p class="text-2xl font-semibold text-gray-900 text-center">
    No hay turnos para mostrar
  </p>
{:else}
  <div class="m-12">
    <table class="w-full text-l text-left text-black-500">
      <thead class="text-l text-black uppercase bg-orange-200">
        <tr>
          {#each tableHeaders as header}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data.appointments as appointment}
          <tr class="border-b bg-teal-100/75 hover:bg-teal-200">
            <td>{appointment.id}</td>
            <td>{appointment.createdAt.toLocaleDateString()}</td>
            <td>{appointment.client.email}</td>
            <td>{appointment.date.toLocaleDateString()}</td>
            <td>{dayTimeMapper(appointment.daytime)}</td>
            <td>{appointmentReasonMapper(appointment.reason)}</td>
            <td>{appointmentStateMapper(appointment.state)}</td>
            <td
              >{`${
                appointment.dog.name
              } - ${appointment.dog.birthdate.toLocaleDateString()}`}</td
            >
            <td class="flex flex-row justify-around mr-3 ml-1">
              {#if appointment.state == AppointmentState.CONFIRMED}
                <form action="?/cancel" method="post">
                  <input
                    type="text"
                    name="appointmentId"
                    value={appointment.id}
                    class="hidden"
                  />
                  <button type="submit" class="btn variant-filled btn-sm"
                    >Cancelar</button
                  >
                </form>
                <form action="?/complete" method="post">
                  <input
                    type="text"
                    name="appointmentId"
                    value={appointment.id}
                    class="hidden"
                  />
                  <button type="submit" class="btn variant-filled btn-sm"
                    >Efectivizar</button
                  >
                </form>
              {:else if appointment.state == AppointmentState.VET_REQUEST}
                <form action="?/cancel" method="post">
                  <input
                    type="text"
                    name="appointmentId"
                    value={appointment.id}
                    class="hidden"
                  />
                  <button type="submit" class="btn variant-filled btn-sm"
                    >Cancelar</button
                  >
                </form>
              {:else if appointment.state == AppointmentState.CLIENT_REQUEST}
                <form action="?/confirm" method="post">
                  <input
                    type="text"
                    name="appointmentId"
                    value={appointment.id}
                    class="hidden"
                  />
                  <button type="submit" class="btn variant-filled btn-sm"
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
                  <button type="submit" class="btn variant-filled btn-sm"
                    >Rechazar</button
                  >
                </form>
                <a
                  href="/vet/appointment/change/{appointment.id}"
                  class="btn variant-filled btn-sm">Proponer cambio</a
                >
              {:else if appointment.state == AppointmentState.CANCELLED || appointment.state == AppointmentState.DONE || appointment.state == AppointmentState.CLIENT_REJECTED || appointment.state == AppointmentState.VET_REJECTED}
                <p>Turno cerrado</p>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
