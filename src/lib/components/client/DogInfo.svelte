<script lang="ts">
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import DateInput from '$cmp/styledInput/DateInput.svelte';
  import TextInput from '$cmp/styledInput/TextInput.svelte';
  import { te } from '$lib/utils/translateEnums';
  import type { Breed, RegisteredDog } from '@prisma/client';

  export let title: string | undefined = undefined;
  export let dog: RegisteredDog & { breed: Breed };
</script>

<FieldGroup cols="3">
  <svelte:fragment slot="title">
    <h3 class=" text-xl font-semibold text-gray-900">
      {title ?? 'Informacion del perro'}
    </h3>
  </svelte:fragment>

  <svelte:fragment slot="fields">
    <div class=" flex items-center w-full">
      {#if dog.image}
        <img
          src={dog.image.url}
          alt="Foto de {dog.name}"
          class=" inline rounded-full w-16 h-16 mr-4"
        />
      {/if}
      <TextInput label="Nombre" field="name" value={dog.name} readonly />
    </div>
    <TextInput
      label="Tamaño"
      field="size"
      value={te.DogSize(dog.size)}
      readonly
    />
    <DateInput
      label="Nacimiento"
      field="birthdate"
      value={dog.birthdate.toISOString().split('T')[0]}
      readonly
    />
    <TextInput label="Sexo" field="sex" value={te.DogSex(dog.sex)} readonly />
    <TextInput label="Color" field="color" value={dog.color} readonly />
    <TextInput
      label="Observacion"
      field="observation"
      value={dog.observation ?? 'Sin observacion'}
      readonly
    />
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <slot name="actions" />
  </svelte:fragment>
</FieldGroup>
