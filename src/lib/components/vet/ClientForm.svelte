<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import TelInput from '$lib/components/form/TelInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import type { ClientCompleteRegisterSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';

  export let sForm: SuperForm<ClientCompleteRegisterSchema, unknown>;
</script>

<FieldGroup>
  <svelte:fragment slot="title">Nuevo cliente</svelte:fragment>

  <svelte:fragment slot="fields">
    <TextInput
      label="Nombre"
      autocomplete="given-name"
      form={sForm}
      field="firstname"
    />
    <TextInput
      label="Apellido"
      autocomplete="family-name"
      form={sForm}
      field="lastname"
    />
    <EmailInput
      label="Direccion de email"
      autocomplete={false}
      form={sForm}
      field="email"
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
    <TextInput label="DNI" autocomplete="off" form={sForm} field="dni" />
  </svelte:fragment>
</FieldGroup>
