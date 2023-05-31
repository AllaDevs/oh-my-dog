<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import { AppointmentReason, Daytime } from '$lib/enums';
  import { dateProxy, superForm } from 'sveltekit-superforms/client';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors, constraints, message } = sForm;

  const clientDogs = data.clientDogs.map((dog) => ({
    value: dog.id,
    label: `${dog.name} - ${dog.birthdate.toLocaleDateString()}`,
  }));
  const formDate = dateProxy(form, 'date', { format: 'date' });
  const today = new Date()
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
  $: if ($message) console.log($message);
</script>

<form method="POST" class=" max-w-sm">
  <div class="space-y-12 space-x-12 flex items-center justify-evenly">
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
          { value: Daytime.MORNING, label: 'Mañana' },
          { value: Daytime.AFTERNOON, label: 'Tarde' },
        ]}
      />
      <SelectInput
        label="Motivo"
        field="reason"
        unselectedLabel="Seleccione un motivo"
        form={sForm}
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
        field="dogId"
        unselectedLabel="Seleccione uno de sus perros"
        form={sForm}
        options={clientDogs}
      />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SubmitButton>Pedir Turno</SubmitButton>
  </div>
  <div class="flex items-center justify-around mt-10 text-xl max-w-full">
    {#if $message}
      <p
        class="text-{$message === 'Pedido de turno exitoso!'
          ? 'green'
          : 'red'}-500 text-sm font-semibold leading-5 mb-4 text-center"
      >
        {$message}
      </p>
    {/if}
  </div>
</form>
