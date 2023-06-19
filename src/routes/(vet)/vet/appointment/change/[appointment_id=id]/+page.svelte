<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { Daytime } from '$lib/enums';
  import { prettyDate } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import { dateProxy, superForm } from 'sveltekit-superforms/client';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors, constraints, message } = sForm;

  const appointment = data.appointment!;

  const formDate = dateProxy(form, 'date', { format: 'date' });
  const today = new Date()
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
  let yearFrom = new Date();
  yearFrom.setFullYear(new Date().getFullYear() + 1);
</script>

<div
  class="flex flex-column space-between mt-10 mb-10 ml-12 mr-12 justify-between items-left"
>
  <h3 class="text-3xl font-semibold text-gray-900">
    Propuesta de cambio del turno
  </h3>
  <p class="btn variant-filled btn-sm">
    Día: {prettyDate(appointment.date)}
  </p>
  <p class="btn variant-filled btn-sm">
    Horario: {te.Daytime(appointment.daytime)}
  </p>
  <p class="btn variant-filled btn-sm">
    Motivo: {te.AppointmentReason(appointment.reason)}
  </p>
</div>

<form method="POST" class=" max-w-sm">
  <div class="space-y-12 space-x-12 flex items-center justify-around">
    <div class="mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
      <DateInput
        label="Fecha"
        field="date"
        unsetLabel="Seleccione una fecha"
        min={today}
        form={sForm}
      />
      <SelectInput
        label="Horario"
        field="daytime"
        unselectedLabel="Seleccione un horario"
        form={sForm}
        options={[
          { value: Daytime.MORNING, text: te.Daytime(Daytime.MORNING) },
          { value: Daytime.AFTERNOON, text: te.Daytime(Daytime.AFTERNOON) },
        ]}
      />
      <TextInput
        label="Mensaje"
        field="message"
        unselectedLabel="Mensaje para el cliente"
        form={sForm}
      />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SubmitButton>Proponer cambio</SubmitButton>
  </div>
  <div class="flex items-center justify-around mt-10 text-xl max-w-full">
    {#if $message}
      <p
        class="text-{$message === 'Pedido de cambio exitoso!'
          ? 'green'
          : 'red'}-500 text-sm font-semibold leading-5 mb-4 text-center"
      >
        {$message}
      </p>
    {/if}
  </div>
</form>
