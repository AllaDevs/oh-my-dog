<script lang="ts">
  import DateInput from '$cmp/form/DateInput.svelte';
  import EmailInput from '$cmp/form/EmailInput.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import TelInput from '$cmp/form/TelInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import type { ClientRegisterSchema } from '$lib/schemas/clientSchema';
  import type { SuperForm } from 'sveltekit-superforms/client';

  export let sForm: SuperForm<ClientRegisterSchema, unknown>;
</script>

<FieldGroup cols="2">
  <svelte:fragment slot="title">
    <slot name="title">
      <h3 class=" text-xl font-semibold text-gray-900">Nuevo cliente</h3>
    </slot>
  </svelte:fragment>

  <svelte:fragment slot="fields">
    <TextInput
      label="Nombre"
      form={sForm}
      field="username"
      autocomplete="given-name"
    />
    <TextInput
      label="Apellido"
      form={sForm}
      field="lastname"
      autocomplete="family-name"
    />
    <EmailInput
      label="Direccion de email"
      form={sForm}
      field="email"
      autocomplete={false}
    />
    <DateInput
      label="Nacimiento"
      min="1923-01-01"
      max="2007-12-31"
      form={sForm}
      field="birthdate"
    />
    <TelInput
      label="Numero de telefono"
      form={sForm}
      field="phone"
      hint="Formato: 123-456-7890"
    />
    <TextInput label="DNI" form={sForm} field="dni" />
  </svelte:fragment>

  <svelte:fragment slot="actions">
    <slot name="actions" />
  </svelte:fragment>
</FieldGroup>
