<script lang="ts">
  import type { AdoptionPostDiscriminatedComplete } from '$lib/types';
  import { dateToShortString } from '$lib/utils/functions';
  import { te } from '$lib/utils/translateEnums';

  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import DateInput from '$lib/components/styledInput/DateInput.svelte';
  import TelInput from '$lib/components/styledInput/TelInput.svelte';
  import TextInput from '$lib/components/styledInput/TextInput.svelte';

  export let post: AdoptionPostDiscriminatedComplete;

  let dog = post.registered ? post.registeredDog : post.temporalDog;
  let author = post.publisher;
</script>

<div class="flex flex-col gap-4 lg:flex-row">
  <FieldGroup cols={2}>
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
      <TextInput
        label="Color"
        field="color"
        value={dog.color}
        readonly={true}
      />
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
  <FieldGroup cols={1}>
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
        readonly={true}
      />
      <TextInput
        label="Apellido"
        field="lastname"
        value={author.lastname}
        readonly={true}
      />
      <TelInput
        label="Telefono"
        field="phone"
        value={author.phone}
        readonly={true}
      />
    </svelte:fragment>
    <svelte:fragment slot="actions" />
  </FieldGroup>
</div>
