<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import DateInput from '$cmp/form/DateInput.svelte';
  import SelectInput from '$cmp/form/SelectInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { AppointmentReason, Daytime } from '$lib/enums';
  import { prettyDate } from '$lib/utils/functions.js';
  import { dateProxy, superForm } from 'sveltekit-superforms/client';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors, constraints, message } = sForm;

  const clientDogs = data.clientDogs.map((dog) => ({
    value: dog.id,
    text: `${dog.name} - ${prettyDate(dog.birthdate)}`,
  }));
  const formDate = dateProxy(form, 'date', { format: 'date' });
  const today = new Date()
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
  $: if ($message) console.log($message);
</script>

<svelte:head>
  <title>Nuevo Turno</title>
</svelte:head>
<Page>
  <main class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
    <form method="POST" class=" mt-2 py-4" enctype="multipart/form-data">
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
            { value: Daytime.MORNING, text: 'Mañana' },
            { value: Daytime.AFTERNOON, text: 'Tarde' },
          ]}
        />
        <SelectInput
          label="Motivo"
          field="reason"
          unselectedLabel="Seleccione un motivo"
          form={sForm}
          options={[
            { value: AppointmentReason.VACCINE, text: 'Vacuna' },
            { value: AppointmentReason.ANTIRABIC, text: 'Antirrábica' },
            { value: AppointmentReason.DEWORMING, text: 'Desparasitación' },
            { value: AppointmentReason.CASTRATION, text: 'Castración' },
            {
              value: AppointmentReason.GENERAL_CONSULTATION,
              text: 'Consulta general',
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

      <div class="mt-6 flex items-center justify-around gap-x-6">
        <Button type="submit" color="primary">Pedir Turno</Button>
      </div>
      <div class="flex items-center justify-around mt-10 text-xl max-w-full">
        {#if $message}
          <p
            class="text-red-500 text-sm font-semibold leading-5 mb-4 text-center"
          >
            {$message}
          </p>
        {/if}
      </div>
    </form>
  </main>
</Page>
