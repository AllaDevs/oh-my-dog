<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import type { TemporalDogRegisterSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import DogSexInput from './DogSexInput.svelte';
  import DogSizeInput from './DogSizeInput.svelte';

  export let sForm: SuperForm<TemporalDogRegisterSchema, unknown>;
  export let breeds: { value: string; text: string }[] = [];
  export let readonly = false;
</script>

<FieldGroup cols="3">
  <svelte:fragment slot="title">
    <slot name="title">
      <h3 class=" text-xl font-semibold text-gray-900">
        Informacion del perro
      </h3>
    </slot>
  </svelte:fragment>

  <svelte:fragment slot="fields">
    <TextInput label="Nombre" form={sForm} field="name" {readonly} />
    <DateInput
      label="Nacimiento estimado"
      form={sForm}
      field="birthdate"
      {readonly}
    />
    <DogSizeInput form={sForm} field="size" {readonly} />
    <DogSexInput form={sForm} field="sex" {readonly} />
    <TextInput label="Color" form={sForm} field="color" {readonly} />
    <TextInput
      label="Observación"
      form={sForm}
      field="observation"
      {readonly}
    />
    <SelectInput
      label="Raza"
      form={sForm}
      field="breedId"
      options={breeds}
      {readonly}
    />
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <slot name="actions" />
  </svelte:fragment>
</FieldGroup>
