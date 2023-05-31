<script lang="ts">
  import DateInput from '$lib/components/styledInput/DateInput.svelte';
  import Fieldset from '$lib/components/styledInput/Fieldset.svelte';
  import TextInput from '$lib/components/styledInput/TextInput.svelte';

  import { te } from '$lib/utils/translateEnums';
  import type { Breed, RegisteredDog } from '@prisma/client';

  export let dog: RegisteredDog & { breed: Breed };
</script>

<div class=" flex flex-col gap-8">
  <Fieldset disabled={true}>
    <svelte:fragment slot="fields">
      <div class=" flex items-center w-full">
        {#if dog.image}
          <img
            src={dog.image.url}
            alt="Foto de {dog.name}"
            class=" inline rounded-full w-16 h-16 mr-4"
          />
        {/if}
        <TextInput
          label="Nombre"
          field="name"
          value={dog.name}
          readonly={true}
        />
      </div>
      <TextInput
        label="Tamaño"
        field="size"
        value={te.DogSize(dog.size)}
        readonly={true}
      />
      <DateInput
        label="Nacimiento"
        field="birthdate"
        value={dog.birthdate.toISOString().split('T')[0]}
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
    </svelte:fragment>
  </Fieldset>
</div>
