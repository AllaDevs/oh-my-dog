<script lang="ts">
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import DateInput from '$cmp/styledInput/DateInput.svelte';
  import EmailInput from '$cmp/styledInput/EmailInput.svelte';
  import TelInput from '$cmp/styledInput/TelInput.svelte';
  import TextInput from '$cmp/styledInput/TextInput.svelte';
  import type { Client } from '@prisma/client';

  export let title: string | undefined = undefined;
  export let client: Client;
</script>

<FieldGroup cols="2">
  <svelte:fragment slot="title">
    <h3 class=" text-xl font-semibold text-gray-900">
      {title ?? 'Informacion del cliente'}
    </h3>
  </svelte:fragment>

  <svelte:fragment slot="fields">
    <TextInput
      label="Nombre"
      field="firstname"
      value={client.firstname}
      readonly
    />
    <TextInput
      label="Apellido"
      field="lastname"
      value={client.lastname}
      readonly
    />
    <EmailInput
      label="Direccion de email"
      field="email"
      value={client.email}
      readonly
    />
    <DateInput
      label="Nacimiento"
      field="birthdate"
      value={client.birthdate.toISOString().split('T')[0]}
      readonly
    />
    <TelInput
      label="Numero de telefono"
      field="phone"
      value={client.phone}
      readonly
    />
    <TextInput label="DNI" field="dni" value={`${client.dni}`} readonly />
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <slot name="actions" />
  </svelte:fragment>
</FieldGroup>
