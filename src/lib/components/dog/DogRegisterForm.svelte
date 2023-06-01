<script lang="ts">
  import type { DogRegisterSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  import DateInput from '$lib/components/form/DateInput.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import ImageInput from '../form/ImageInput.svelte';
  import DogSexInput from './DogSexInput.svelte';
  import DogSizeInput from './DogSizeInput.svelte';

  export let action: string | undefined = undefined;
  export let sForm: SuperForm<DogRegisterSchema, unknown>;
  export let breeds: { value: string; text: string }[] = [];
  export let title: string | undefined = undefined;
  export let readonlyFields: {
    [key in keyof z.infer<DogRegisterSchema>]?: true;
  } = {};
</script>

<form method="POST" {action} enctype="multipart/form-data" use:sForm.enhance>
  <FieldGroup cols={2}>
    <svelte:fragment slot="title">
      <slot name="title">
        <h3 class=" text-xl font-semibold text-gray-900">
          {title ?? 'Informacion del perro'}
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
      <ImageInput
        label="Imagen"
        form={sForm}
        field="image"
        readonly={readonlyFields.image ?? false}
      />
    </svelte:fragment>
    <svelte:fragment slot="actions">
      <slot name="actions" />
    </svelte:fragment>
  </FieldGroup>
</form>
