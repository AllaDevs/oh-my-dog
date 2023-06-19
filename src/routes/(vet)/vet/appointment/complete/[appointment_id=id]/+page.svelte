<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import TextAreaInput from '$lib/components/form/TextAreaInput.svelte';
  import { prettyDate } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors, constraints, message } = sForm;

  const appointment = data.appointment!;
</script>

<Page>
  <div class="mt-10 mb-3 ml-12">
    <h3 class="text-3xl font-semibold text-gray-900">
      Efectivizar el turno: <b>{appointment.id}</b>
    </h3>
    <div class="mt-5">
      <p class="btn variant-filled btn-sm">
        <b>Día:</b>
        {prettyDate(appointment.date)}
      </p>
      <p class="btn variant-filled btn-sm">
        <b>Horario:</b>
        {te.Daytime(appointment.daytime)}
      </p>
      <p class="btn variant-filled btn-sm">
        <b>Motivo:</b>
        {te.AppointmentReason(appointment.reason)}
      </p>
    </div>
  </div>

  <div class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
    <form method="POST" class=" mt-2 py-4" enctype="multipart/form-data">
      <div class=" pb-4 flex flex-col gap-4">
        <FieldGroup cols="1">
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              Datos para el registro médico:
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextAreaInput
              label="Observación"
              field="observation"
              unselectedLabel="Observaciones del turno: "
              form={sForm}
              required={false}
            />
          </svelte:fragment>
          <svelte:fragment slot="actions" />
        </FieldGroup>
        <div class="mt-6 flex items-center justify-around gap-x-6">
          <Button type="submit" color="primary">Efectivizar</Button>
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
  </div>
</Page>
