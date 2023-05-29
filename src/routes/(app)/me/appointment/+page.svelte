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
  <a href="/me/appointment/request" class="btn variant-filled btn-sm"
    >Nuevo Turno</a
  >
</div>
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
      {#each data.clientAppointments as appointment}
        <tr class="border-b bg-teal-100/75 hover:bg-teal-200">
          <td>{appointment.id}</td>
          <td>{appointment.createdAt.toLocaleDateString()}</td>
          <td>{appointment.updatedAt.toLocaleDateString()}</td>
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
            {#if appointment.state == AppointmentState.VET_REQUEST}
              <form action="?/confirm" method="post">
                <input
                  type="text"
                  name="appointmentId"
                  value={appointment.id}
                  class="hidden"
                />
                <button type="submit" class="btn variant-filled btn-sm"
                  >Aceptar Cambio</button
                >
              </form>
            {:else}
              <p>Sin acciones</p>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
