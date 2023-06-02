<script lang="ts">
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import type { ProviderCompleteRegisterSchema } from '$lib/schemas/providerSchema';
  import { Day } from '@prisma/client';
  import { createEventDispatcher } from 'svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import FieldGroup from '../form/FieldGroup.svelte';
  import HourInput from '../form/HourInput.svelte';

  export let sForm: SuperForm<ProviderCompleteRegisterSchema, unknown>;
  export let index: number;
  export let title: string | undefined = undefined;
  export let allowRemoval: boolean = true;

  const dispatch = createEventDispatcher<{ remove: number }>();

  const today = new Date()
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
</script>

<FieldGroup cols={2}>
  <svelte:fragment slot="title">
    <h3 class=" text-xl font-semibold text-gray-900">
      {title}
    </h3>
    {#if allowRemoval}
      <button
        type="button"
        class="rounded-md bg-red-700/95 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        on:click={() => dispatch('remove', index)}
      >
        Remover
      </button>
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="fields">
    <SelectInput
      label="Día de la semana"
      unselectedLabel="Sin seleccionar"
      field={['workingHour', index, 'day']}
      form={sForm}
      options={[
        { value: Day.MONDAY, text: 'Lunes' },
        { value: Day.TUESDAY, text: 'Martes' },
        { value: Day.WEDNESDAY, text: 'Miercoles' },
        { value: Day.THURSDAY, text: 'Jueves' },
        { value: Day.FRIDAY, text: 'Viernes' },
        { value: Day.SATURDAY, text: 'Sabado' },
        { value: Day.SUNDAY, text: 'Domingo' },
      ]}
      required
    />
    <HourInput
      label="Hora de inicio"
      unselectedLabel="Sin seleccionar"
      field={['workingHour', index, 'start']}
      form={sForm}
      required
    />
    <HourInput
      label="Hora de fin"
      unselectedLabel="Sin seleccionar"
      field={['workingHour', index, 'end']}
      form={sForm}
      required
    />
  </svelte:fragment>
  <svelte:fragment slot="actions" />
</FieldGroup>
