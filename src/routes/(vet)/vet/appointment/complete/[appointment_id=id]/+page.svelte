<script lang="ts">
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { prettyDate } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors, constraints, message } = sForm;

  const appointment = data.appointment!;
</script>

<div
  class="flex flex-column space-between mt-10 mb-10 ml-12 mr-12 justify-between items-left"
>
  <h3 class="text-3xl font-semibold text-gray-900">Efectivizar el turno:</h3>
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
      <TextInput
        label="Observaciones"
        field="observation"
        unselectedLabel="Observaciones del turno"
        form={sForm}
      />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SubmitButton>Efectivizar</SubmitButton>
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
