<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import TextAreaInput from '$cmp/form/TextAreaInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import DateInput from '$lib/components/form/DateInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
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

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="flex flex-col justify-between mb-7 mt-7">
    <h2 class=" mt-4 text-2xl">Proponer cambio de turno</h2>
    <p class="text-gray-700 text-lg mt-4">
      Día: {prettyDate(appointment.date)}
    </p>
    <p class="text-gray-700 text-lg">
      Horario: {te.Daytime(appointment.daytime)}
    </p>
    <p class="text-gray-700 text-lg">
      Motivo: {te.AppointmentReason(appointment.reason)}
    </p>
  </div>

  <form method="POST" class=" mt-2 py-4">
    <div class=" pb-4 flex flex-col gap-4">
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
      <TextAreaInput
        label="Mensaje"
        field="message"
        unselectedLabel="Mensaje para el cliente"
        form={sForm}
      />

      <div class="mt-6 flex items-center justify-around gap-x-6">
        <Button type="submit" color="primary">Proponer cambio</Button>
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
    </div>
  </form>
</Page>
