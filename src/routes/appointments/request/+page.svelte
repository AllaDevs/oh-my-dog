<script lang="ts">
  import { page } from '$app/stores';
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import InputField from '$lib/components/InputField.svelte';
  import { Daytime, AppointmentReason } from '@prisma/client';

  export let data: PageData;

  const { form, errors, constraints } = superForm(data.form);
  $: authorizationMessage = $page.url.searchParams.get('message') ?? '';
</script>

{#if authorizationMessage}
  <p class="text-red-500 text-sm font-semibold leading-5 mb-4">
    {authorizationMessage}
  </p>
{/if}

<form method="POST" class=" max-w-sm">
  <div class="space-y-12">
    <div class="mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
      <InputField label="Fecha" name="date">
        <input
          type="date"
          name="date"
          bind:value={$form.date}
          {...$constraints.date}
          data-invalid={$errors.date}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </InputField>
      <InputField label="Horario" name="daytime">
        <select
          name="daytime"
          bind:value={$form.daytime}
          {...$constraints.daytime}
          data-invalid={$errors.daytime}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value={Daytime.MORNING}>Mañana</option>
          <option value={Daytime.AFTERNOON}>Tarde</option>
        </select>
      </InputField>
      <InputField label="Motivo" name="reason">
        <select
          name="reason"
          bind:value={$form.reason}
          {...$constraints.reason}
          data-invalid={$errors.reason}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value={AppointmentReason.VACCINE}>Vacuna</option>
          <option value={AppointmentReason.ANTIRABIC}>Antirrábica</option>
          <option value={AppointmentReason.DEWORMING}>Desparasitación</option>
          <option value={AppointmentReason.CASTRATION}>Castración</option>
          <option value={AppointmentReason.GENERAL_CONSULTATION}
            >Consulta general</option
          >
        </select>
      </InputField>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <button
      type="submit"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >Pedir turno</button
    >
  </div>
</form>
