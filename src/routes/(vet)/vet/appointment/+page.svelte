<script lang="ts">
  import { DropdownMenu, DropdownMenuItem } from '$cmp/dropdown/index.js';
  import Page from '$cmp/layout/Page.svelte';
  import A from '$lib/components/element/A.svelte';
  import { AppointmentReason, AppointmentState } from '$lib/enums';
  import { prettyDate } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import toast from 'svelte-french-toast';

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

  let clientOptions;

  $: {
    clientOptions = [];
    for (const client of data.clients) {
      clientOptions.push({
        value: client.id,
        text: client.email,
      });
    }
  }

  let filterState = '';
  let filterReason = '';

  let filterFrom = '';
  $: filterFromDate = filterFrom ? new Date(filterFrom) : undefined;

  let filterUntil = '';
  $: filterUntilDate = filterUntil ? new Date(filterUntil) : undefined;

  let filterClient = '';
  let sortByEmail: 'desc' | 'asc' | '' = '';

  function resetFilters() {
    filterState = '';
    filterReason = '';
    filterFrom = '';
    filterUntil = '';
    filterClient = '';
    sortByEmail = '';
  }

  const appointments = [...data.appointments];

  let visibleAppointments: typeof appointments;
  $: {
    visibleAppointments = appointments.filter((a) => {
      return (
        (!filterState || a.state === filterState) &&
        (!filterReason || a.reason === filterReason) &&
        (!filterClient || a.client.email === filterClient) &&
        (!filterFromDate || a.date >= filterFromDate) &&
        (!filterUntilDate || a.date <= filterUntilDate)
      );
    });
  }
  $: {
    switch (sortByEmail) {
      case 'desc': {
        visibleAppointments.sort((appA, appB) =>
          appA.client.email.localeCompare(appB.client.email)
        );
        break;
      }
      case 'asc': {
        visibleAppointments.sort((appA, appB) =>
          appB.client.email.localeCompare(appA.client.email)
        );
        break;
      }
      default: {
        visibleAppointments.sort(
          (appA, appB) => appB.date.getTime() - appA.date.getTime()
        );
      }
    }
    visibleAppointments = visibleAppointments;
  }
</script>

<svelte:head>
  <title>Turnos</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="flex justify-between items-end mb-7 mt-7">
    <h2 class=" mt-4 text-2xl">Listado de turnos</h2>
    <DropdownMenu label="Filtrar">
      <svelte:fragment slot="items">
        <DropdownMenuItem class=" flex flex-col">
          <label for="state">Estado</label>
          <select
            name=""
            id="state"
            bind:value={filterState}
            class="w-max mt-2 block rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          >
            <option value="" />
            {#each Object.values(AppointmentState) as state}
              <option value={state}>{te.AppointmentState(state)}</option>
            {/each}
          </select>
        </DropdownMenuItem>
        <DropdownMenuItem class=" flex flex-col">
          <label for="reason">Motivo</label>
          <select
            name=""
            id="size"
            bind:value={filterReason}
            class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          >
            <option value="" />
            {#each Object.values(AppointmentReason) as reason}
              <option value={reason}>{te.AppointmentReason(reason)}</option>
            {/each}
          </select>
        </DropdownMenuItem>

        <span class="border-b my-2 border-gray-400" />

        <DropdownMenuItem class=" flex flex-col">
          <label for="from">Fecha inicio</label>
          <input
            type="date"
            name=""
            id="from"
            autocomplete="off"
            bind:value={filterFrom}
            class=" mt-2 block w-full rounded-md border-none py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          />
        </DropdownMenuItem>
        <DropdownMenuItem class=" flex flex-col">
          <label for="until">Fecha fin</label>
          <input
            type="date"
            name=""
            id="until"
            autocomplete="off"
            bind:value={filterUntil}
            class=" mt-2 block w-full rounded-md border-none py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          />
        </DropdownMenuItem>
        <DropdownMenuItem class=" flex flex-col">
          <label for="email">Orden email</label>
          <select
            name=""
            id="email"
            bind:value={sortByEmail}
            class="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          >
            <option value="" />
            <option value="desc">Descensente</option>
            <option value="asc">Ascendente</option>
          </select>
        </DropdownMenuItem>

        <DropdownMenuItem class=" mt-4">
          <button
            on:click={resetFilters}
            class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Resetear los filtros
          </button>
        </DropdownMenuItem>
      </svelte:fragment>
    </DropdownMenu>
  </div>

  {#if !data.appointments.length}
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
