<script lang="ts">
  import DniInput from '$cmp/form/DniInput.svelte';
import DateInput from '$lib/components/form/DateInput.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import TelInput from '$lib/components/form/TelInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  import type { ClientCompleteRegisterSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';

  export let sForm: SuperForm<ClientCompleteRegisterSchema, unknown>;
  export let title: string | undefined = undefined;
</script>

<FieldGroup cols="2">
  <svelte:fragment slot="title">
    <h3 class=" text-xl font-semibold text-gray-900">
      {title ?? 'Nuevo cliente'}
    </h3>
  </svelte:fragment>
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
      label="Telefono"
      form={sForm}
      field="phone"
      hint="Formato: 123-456-7890"
    />
    <DniInput form={sForm} field="dni" />
  </svelte:fragment>
  <svelte:fragment slot="actions" />
</FieldGroup>
