<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import A from '$lib/components/element/A.svelte';
  import { AppointmentState } from '$lib/enums';
  import { prettyDate } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import toast from 'svelte-french-toast';

  let formModal = false;
  export let data;

  const tableHeaders = [
    'Pedido en',
    'Cliente',
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

  const appointmentToast = (() => {
    return async ({ result }) => {
      switch (result.type) {
        // SUCCESS
        case 'success': {
          toast.success('Turno modificado con éxito');
          break;
        }
        // FAILURE
        case 'failure': {
          toast.error(
            `Ocurrió un error inesperado al intentar modificar el turno`
          );
          break;
        }
        // ERROR
        case 'error': {
          toast.error(String(result.error));
          break;
        }
        // REDIRECT WITH SUCCESS MESSAGE
        case 'redirect': {
          toast.success('Turno modificado con éxito');
          break;
        }
      }
    };
  }) satisfies SubmitFunction;

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

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="flex flex-row justify-between mb-7 mt-7">
    <h2 class=" mt-4 text-2xl">Listado de turnos</h2>
    <A href="/vet/appointment" color="primary" button={true}>Filtrar</A>
  </div>
  {#if !data.appointments || data.appointments.length == 0}
    <p class="text-2xl font-semibold text-gray-900 text-center">
      No hay turnos para mostrar
    </p>
  {:else}
    <article class="px-4 py-2">
      <div class="relative overflow-x-auto m-7">
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
            {#each data.appointments as appointment}
              <tr class="border-b bg-teal-100/75 hover:bg-teal-200">
                <td class="px-4 py-3">{prettyDate(appointment.createdAt)}</td>
                <td class="px-4 py-3">{appointment.client.email}</td>
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
                    {#if appointment.state == AppointmentState.CONFIRMED}
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
                          >Cancelar</button
                        >
                      </form>
                      {#if appointment.date <= new Date(Date.now() + 86400000)}
                        <A
                          href="/vet/appointment/complete/{appointment.id}"
                          color="primary"
                          button={true}>Efectivizar</A
                        >
                      {/if}
                    {:else if appointment.state == AppointmentState.VET_REQUEST}
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
                          >Cancelar</button
                        >
                      </form>
                    {:else if appointment.state == AppointmentState.CLIENT_REQUEST}
                      <form
                        action="?/confirm"
                        method="post"
                        on:submit={(e) => openConfirmation(e, 'aceptar')}
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
                          >Aceptar</button
                        >
                      </form>
                      <form
                        action="?/reject"
                        method="post"
                        on:submit={(e) => openConfirmation(e, 'rechazar')}
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
                          >Rechazar</button
                        >
                      </form>
                      <A
                        href="/vet/appointment/change/{appointment.id}"
                        color="primary"
                        button={true}>Proponer Cambio</A
                      >
                    {:else if appointment.state == AppointmentState.CANCELLED || appointment.state == AppointmentState.DONE || appointment.state == AppointmentState.CLIENT_REJECTED || appointment.state == AppointmentState.VET_REJECTED}
                      <p>Turno cerrado</p>
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
