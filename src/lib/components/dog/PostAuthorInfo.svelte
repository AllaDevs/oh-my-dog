<script lang="ts">
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import TelInput from '$lib/components/styledInput/TelInput.svelte';
  import TextInput from '$lib/components/styledInput/TextInput.svelte';

  type T = $$Generic<{
    firstname: string;
    lastname: string;
    phone: string;
  }>;

  export let author: T;
</script>

<FieldGroup>
  <svelte:fragment slot="title">
    <slot name="title">
      <h3 class=" text-xl font-semibold text-gray-900">
        Informacion del publicador
      </h3>
    </slot>
  </svelte:fragment>
  <svelte:fragment slot="fields">
    <TextInput
      label="Nombre"
      field="firstname"
      value={author.firstname}
      readonly
    />
    <TextInput
      label="Apellido"
      field="lastname"
      value={author.lastname}
      readonly
    />
    <TelInput label="Telefono" field="phone" value={author.phone} readonly />
  </svelte:fragment>
</FieldGroup>
