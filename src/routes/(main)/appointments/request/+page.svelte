<script lang="ts">
  import { page } from '$app/stores';
  import { dateProxy, superForm } from 'sveltekit-superforms/client';
  import { Daytime, AppointmentReason } from '$lib/enums';
  import DateInput from '$lib/components/form/DateInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  const { form, errors, constraints, message } = superForm(data.form);
  const clientDogs = data.clientDogs.map((dog) => ({
    value: dog.id,
    label: `${dog.name} - ${dog.birthdate}`,
  }));
  const formDate = dateProxy(form, 'date', { format: 'date' });
  const today = new Date()
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
  let yearFrom = new Date();
  yearFrom.setFullYear(new Date().getFullYear() + 1);
  const yearFromString = yearFrom
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
</script>

<form method="POST" class=" max-w-sm">
  <div class="space-y-12">
    <div class="mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
      <DateInput
        label="Fecha"
        name="date"
        unsetLabel="Seleccione una fecha"
        min={today}
        max={yearFromString}
        constraints={$constraints.date}
        bind:value={$formDate}
        errors={$errors.date}
      />
      <SelectInput
        label="Horario"
        name="daytime"
        unselectedLabel="Seleccione un horario"
        constraints={$constraints.daytime}
        bind:value={$form.daytime}
        errors={$errors.daytime}
        options={[
          { value: Daytime.MORNING, label: 'Mañana' },
          { value: Daytime.AFTERNOON, label: 'Tarde' },
        ]}
      />
      <SelectInput
        label="Motivo"
        name="reason"
        unselectedLabel="Seleccione un motivo"
        constraints={$constraints.reason}
        bind:value={$form.reason}
        errors={$errors.reason}
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
      <SelectInput
        label="Perro"
        name="dogId"
        unselectedLabel="Seleccione un perro"
        constraints={$constraints.dogId}
        bind:value={$form.dogId}
        errors={$errors.dogId}
        options={clientDogs}
      />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SubmitButton>Pedir Turno</SubmitButton>
  </div>
  {#if $message}
    <p
      class="text-{$message === 'Pedido de turno rechazado!'
        ? 'red'
        : 'green'}-500 text-sm font-semibold leading-5 mb-4"
    >
      {$message}
    </p>
  {/if}
</form>
