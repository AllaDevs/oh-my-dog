<script lang="ts">
  import DogSexInput from '$cmp/dog/DogSexInput.svelte';
  import DogSizeInput from '$cmp/dog/DogSizeInput.svelte';
  import DateInput from '$cmp/form/DateInput.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import ImageInput from '$cmp/form/ImageInput.svelte';
  import SelectInput from '$cmp/form/SelectInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import type { DogRegisterSchema } from '$lib/schemas';
  import { getYMDAR } from '$lib/utils/functions';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z } from 'zod';

  export let action: string | undefined = undefined;
  export let sForm: SuperForm<DogRegisterSchema, unknown>;
  export let breeds: { value: string; text: string }[] = [];
  export let title: string | undefined = undefined;
  export let readonlyFields: {
    [key in keyof z.infer<DogRegisterSchema>]?: true;
  } = {};

  const today = getYMDAR(new Date());
</script>

<form method="POST" {action} enctype="multipart/form-data" use:sForm.enhance>
  <FieldGroup cols="2">
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
        max={today}
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
