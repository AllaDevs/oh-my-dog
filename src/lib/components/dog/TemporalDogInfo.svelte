<script lang="ts">
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import DateInput from '$lib/components/styledInput/DateInput.svelte';
  import TextInput from '$lib/components/styledInput/TextInput.svelte';
  import { dateToShortString } from '$lib/utils/functions';
  import { te } from '$lib/utils/translateEnums';
  import type { RegisteredDog, TemporalDog } from '@prisma/client';

  export let dog: (TemporalDog | RegisteredDog) & {
    breed: {
      name: string;
    };
  };
</script>

<FieldGroup>
  <svelte:fragment slot="title">
    <slot name="title">
      <h3 class=" text-xl font-semibold text-gray-900">
        Informacion del perro
      </h3>
    </slot>
  </svelte:fragment>

  <svelte:fragment slot="fields">
    <img
      class="rounded-full w-24 h-24 mx-auto"
      src={dog.image?.url ?? '/dog_silhouette.png'}
      alt="dog"
    />
    <TextInput label="Nombre" field="name" value={dog.name} readonly />
    <DateInput
      label="Nacimiento estimado"
      value={dateToShortString(dog.birthdate)}
      field="birthdate"
    />
    <TextInput
      label="Tamaño"
      field="size"
      value={te.DogSize(dog.size)}
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
    <TextInput label="Raza" field="breed" value={dog.breed.name} readonly />
  </svelte:fragment>
</FieldGroup>
