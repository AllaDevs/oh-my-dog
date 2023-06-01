<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  import { DogSex, DogSize } from '$lib/enums';
  import type { ClientCompleteRegisterSchema } from '$lib/schemas';
  import { createEventDispatcher } from 'svelte';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import FieldGroup from '../form/FieldGroup.svelte';

  export let sForm: SuperForm<ClientCompleteRegisterSchema, unknown>;
  export let index: number;
  export let title: string | undefined = undefined;
  export let breeds: { value: string; text: string }[];
  export let allowRemoval: boolean = true;

  const dispatch = createEventDispatcher<{ remove: number }>();
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
    <TextInput label="Nombre" field={['dogs', index, 'name']} form={sForm} />
    <DateInput
      label="Fecha de nacimiento o aproximada"
      field={['dogs', index, 'birthdate']}
      min="1923-01-01"
      max="2007-12-31"
      form={sForm}
      hint=""
    />
    <TextInput
      label="Color o descripción pequeña"
      field={['dogs', index, 'color']}
      form={sForm}
    />
    <TextInput
      label="Observacion"
      field={['dogs', index, 'observation']}
      form={sForm}
    />
    <SelectInput
      label="Tamaño"
      unselectedLabel="Sin seleccionar"
      field={['dogs', index, 'size']}
      form={sForm}
      options={[
        { value: DogSize.SMALL, text: 'Pequeño' },
        { value: DogSize.MEDIUM, text: 'Mediano' },
        { value: DogSize.BIG, text: 'Grande' },
      ]}
    />
    <SelectInput
      label="Sexo"
      unselectedLabel="Sin seleccionar"
      field={['dogs', index, 'sex']}
      form={sForm}
      options={[
        { value: DogSex.FEMALE, text: 'Hembra' },
        { value: DogSex.MALE, text: 'Macho' },
      ]}
    />
    <SelectInput
      label="Raza"
      unselectedLabel="Sin seleccionar"
      field={['dogs', index, 'breedId']}
      form={sForm}
      options={breeds}
    />
    <ImageInput label="Imagen" field={['dogs', index, 'image']} form={sForm} />
  </svelte:fragment>
  <svelte:fragment slot="actions" />
</FieldGroup>
