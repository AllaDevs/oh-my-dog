<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import Fieldset from '$lib/components/form/Fieldset.svelte';
  import TelInput from '$lib/components/form/TelInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  import type { UnwrapEffects } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';

  type T = $$Generic<AnyZodObject>;

  export let sForm: SuperForm<UnwrapEffects<T>, unknown>;
  export let legend: string = 'Nuevo cliente';
</script>

<Fieldset>
  <svelte:fragment slot="legend">{legend}</svelte:fragment>
  <svelte:fragment slot="fields">
    <TextInput
      label="Nombre"
      name="username"
      autocomplete="given-name"
      form={sForm}
      field="username"
    />
    <TextInput
      label="Apellido"
      name="lastname"
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
</Fieldset>
