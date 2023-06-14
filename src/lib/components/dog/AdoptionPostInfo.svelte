<script lang="ts">
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import DateInput from '$cmp/styledInput/DateInput.svelte';
  import TextInput from '$cmp/styledInput/TextInput.svelte';
  import type { AdoptionPostDiscriminatedComplete } from '$lib/types';
  import { dateToShortString } from '$lib/utils/functions';
  import { te } from '$lib/utils/translateEnums';

  export let post: AdoptionPostDiscriminatedComplete;

  let dog = post.registered ? post.registeredDog : post.temporalDog;
  let author = post.publisher;
</script>

<div class="flex flex-col gap-4 lg:flex-row">
  <FieldGroup cols="2">
    <svelte:fragment slot="title">
      <h3 class=" text-lg font-semibold text-gray-900">
        Informacion del perro
      </h3>
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
        readonly
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

  <FieldGroup cols="1">
    <svelte:fragment slot="title">
      <h3 class=" text-lg font-semibold text-gray-900">
        Informacion del publicador
      </h3>
    </svelte:fragment>

    <svelte:fragment slot="fields">
      <TextInput
        label="Nombre"
        field="username"
        value={author.username}
        readonly
      />
      <TextInput
        label="Apellido"
        field="lastname"
        value={author.lastname}
        readonly
      />
    </svelte:fragment>
  </FieldGroup>
</div>
