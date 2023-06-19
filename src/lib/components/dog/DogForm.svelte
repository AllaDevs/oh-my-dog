<script lang="ts">
  import DogSexInput from '$cmp/dog/DogSexInput.svelte';
  import DogSizeInput from '$cmp/dog/DogSizeInput.svelte';
  import DateInput from '$cmp/form/DateInput.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import SelectInput from '$cmp/form/SelectInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import type { DogRegisterSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let sForm: SuperForm<DogRegisterSchema, unknown>;
  export let breeds: { value: string; text: string }[] = [];
  export let readonlyFields: {
    [key in keyof z.infer<DogRegisterSchema>]?: true;
  } = {};
</script>

<FieldGroup cols="2">
  <svelte:fragment slot="title">
    <slot name="title">
      <h3 class=" text-xl font-semibold text-gray-900">
        Informacion del perro
      </h3>
    </slot>
  </svelte:fragment>
  <svelte:fragment slot="fields">
    <TextInput
      label="Nombre"
      form={sForm}
      field="name"
      readonly={readonlyFields.name ?? false}
    />
    <DateInput
      label="Nacimiento estimado"
      form={sForm}
      field="birthdate"
      readonly={readonlyFields.birthdate ?? false}
    />
    <DogSizeInput
      form={sForm}
      field="size"
      readonly={readonlyFields.size ?? false}
    />
    <DogSexInput
      form={sForm}
      field="sex"
      readonly={readonlyFields.sex ?? false}
    />
    <TextInput
      label="Color"
      form={sForm}
      field="color"
      readonly={readonlyFields.color ?? false}
    />
    <TextInput
      label="Observación"
      form={sForm}
      field="observation"
      readonly={readonlyFields.observation ?? false}
    />
    <SelectInput
      label="Raza"
      form={sForm}
      field="breedId"
      readonly={readonlyFields.breedId ?? false}
      options={breeds}
    />
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <slot name="actions" />
  </svelte:fragment>
</FieldGroup>
