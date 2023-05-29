<script lang="ts">
  import DateInput from '$lib/components/styledInput/DateInput.svelte';
  import EmailInput from '$lib/components/styledInput/EmailInput.svelte';
  import Fieldset from '$lib/components/styledInput/Fieldset.svelte';
  import TelInput from '$lib/components/styledInput/TelInput.svelte';
  import TextInput from '$lib/components/styledInput/TextInput.svelte';
  import type { Client } from '@prisma/client';

  export let client: Client;
</script>

<div class=" flex flex-col gap-8">
  <Fieldset disabled={true}>
    <svelte:fragment slot="legend">Datos personales</svelte:fragment>
    <svelte:fragment slot="fields">
      <TextInput
        label="Nombre"
        field="username"
        value={client.username}
        readonly={true}
      />
      <TextInput
        label="Apellido"
        field="lastname"
        value={client.lastname}
        readonly={true}
      />
      <EmailInput
        label="Direccion de email"
        field="email"
        value={client.username}
        readonly={true}
      />
      <DateInput
        label="Nacimiento"
        field="birthdate"
        value={client.birthdate.toISOString().split('T')[0]}
        readonly={true}
      />
      <TelInput
        label="Numero de telefono"
        field="phone"
        value={client.phone}
        readonly={true}
      />
      <TextInput label="DNI" field="dni" value={client.dni} readonly={true} />
    </svelte:fragment>
    <svelte:fragment slot="actions">
      <a
        href="/me/account"
        class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      >
        Actualizar autenticacion
      </a>
    </svelte:fragment>
  </Fieldset>
</div>
