<script lang="ts">
  import { dateToShortString } from '$lib/utils/functions';
  import { te } from '$lib/utils/translateEnums';
  import type { RegisteredDog, TemporalDog } from '@prisma/client';

  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import DateInput from '$lib/components/styledInput/DateInput.svelte';
  import TextInput from '$lib/components/styledInput/TextInput.svelte';

  export let dog: (TemporalDog | RegisteredDog) & {
    breed: {
      name: string;
    };
  };
  // export let client: Client;
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
    <TextInput label="Nombre" field="name" value={dog.name} readonly={true} />
    <DateInput
      label="Nacimiento estimado"
      value={dateToShortString(dog.birthdate)}
      field="birthdate"
    />
    <TextInput
      label="Tamaño"
      field="size"
      value={te.DogSize(dog.size)}
      readonly={true}
    />
    <TextInput
      label="Sexo"
      field="sex"
      value={te.DogSex(dog.sex)}
      readonly={true}
    />
    <TextInput label="Color" field="color" value={dog.color} readonly={true} />
    <TextInput
      label="Observacion"
      field="observation"
      value={dog.observation ?? 'Sin observacion'}
      readonly={true}
    />
    <TextInput
      label="Raza"
      field="breed"
      value={dog.breed.name}
      readonly={true}
    />
  </svelte:fragment>
  <svelte:fragment slot="actions" />
</FieldGroup>
