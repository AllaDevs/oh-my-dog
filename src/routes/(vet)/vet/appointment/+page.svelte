<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import { AppointmentState } from '$lib/enums';
  import { prettyDate } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';

  let formModal = false;
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

  // interface filters {
  //   state: AppointmentState | undefined;
  //   reason: AppointmentReason | undefined;
  //   from: Date | undefined;
  //   until: Date | undefined;
  //   client: String | undefined;
  // }

  // let actualFilters: filters = {
  //   state: undefined,
  //   reason: undefined,
  //   from: undefined,
  //   until: undefined,
  //   client: undefined,
  // };

  // const filterAppointments = () => {
  //   let appointments = data.appointments;
  //   if (actualFilters.state !== undefined) {
  //     appointments = appointments.filter(
  //       (appointment) => appointment.state === actualFilters.state
  //     );
  //   }
  //   if (actualFilters.reason !== undefined) {
  //     appointments = appointments.filter(
  //       (appointment) => appointment.reason === actualFilters.reason
  //     );
  //   }
  //   if (actualFilters.from !== undefined) {
  //     appointments = appointments.filter(
  //       (appointment) => appointment.date >= actualFilters.from
  //     );
  //   }
  //   if (actualFilters.until !== undefined) {
  //     appointments = appointments.filter(
  //       (appointment) => appointment.date <= actualFilters.until
  //     );
  //   }
  //   if (actualFilters.client !== undefined) {
  //     appointments = appointments.filter(
  //       (appointment) => appointment.client.email === actualFilters.client
  //     );
  //   }
  //   return appointments;
  // };

  // const clients = data.clients.map((client) => client.email);

  // let untilAux: Date;
  // let fromAux: Date;
</script>

<svelte:head>
  <title>Turnos</title>
</svelte:head>
<!-- 
<div class=" grid mt-2 gap-2 grid-cols-1 md:grid-cols-2 md:gap-x-8">
  <DateInput
    bind:value={actualFilters.from}
    label="Desde"
    field="from"
    unsetLabel="Seleccione una fecha"
    max={untilAux
      ? `${untilAux.getFullYear()}-${untilAux.getMonth()}-${untilAux.getDate()}`
      : undefined}
  />
  <DateInput
    bind:value={actualFilters.until}
    label="Hasta"
    field="until"
    unsetLabel="Seleccione una fecha"
    min={fromAux
      ? `${fromAux.getFullYear()}-${fromAux.getMonth()}-${fromAux.getDate()}`
      : undefined}
  />
  <SelectInput
    bind:value={actualFilters.state}
    label="Horario"
    field="daytime"
    unselectedLabel="Seleccione un horario"
    options={[
      { value: Daytime.MORNING, label: 'Mañana' },
      { value: Daytime.AFTERNOON, label: 'Tarde' },
    ]}
  />
  <SelectInput
    bind:value={actualFilters.reason}
    label="Motivo"
    field="reason"
    unselectedLabel="Seleccione un motivo"
    options={[
      { value: AppointmentReason.VACCINE, label: 'Vacuna' },
      { value: AppointmentReason.ANTIRABIC, label: 'Antirrábica' },
      { value: AppointmentReason.DEWORMING, label: 'Desparasitación' },
      { value: AppointmentReason.CASTRATION, label: 'Castración' },
      {
        value: AppointmentReason.GENERAL_CONSULTATION,
        label: 'Consulta general',
      },
    ]}
  />
  <EmailInput
    bind:value={actualFilters.client}
    label="Cliente"
    field="email"
    unselectedLabel="Seleccione uno de sus perros"
    options={clients}
  />
  <div class="mt-6 flex items-center justify-around gap-x-6">
    <button on:click={() => filterAppointments()}>Filtrar</button>
  </div>
</div> -->

<Page>
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
      <table class="w-full text-l text-black-500 text-center">
        <thead class="text-l text-black uppercase bg-teal-400">
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
              <td>{prettyDate(appointment.createdAt)}</td>
              <td>{appointment.client.email}</td>
              <td>{prettyDate(appointment.date)}</td>
              <td>{te.Daytime(appointment.daytime)}</td>
              <td>{te.AppointmentReason(appointment.reason)}</td>
              <td>{te.AppointmentState(appointment.state)}</td>
              <td
                >{`${appointment.dog.name} - ${prettyDate(
                  appointment.dog.birthdate
                )}`}</td
              >
              <td class="flex flex-row justify-around items-center">
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
                  <a
                    href="/vet/appointment/complete/{appointment.id}"
                    class="btn variant-filled btn-sm">Efectivizar</a
                  >
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
</Page>
