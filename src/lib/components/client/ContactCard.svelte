<script lang="ts">
  import type { ContactBaseSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';

  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TelInput from '$lib/components/form/TelInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  type T = $$Generic<ContactBaseSchema>;

  export let sForm: SuperForm<ContactBaseSchema, unknown>;
</script>

<FieldGroup cols={2}>
  <svelte:fragment slot="title">
    <slot name="title">
      <h3 class=" text-lg font-semibold text-gray-900">
        Formulario de contacto
      </h3>
    </slot>
  </svelte:fragment>
  <svelte:fragment slot="fields">
    <TextInput label="Nombre" field="username" form={sForm} />
    <TextInput label="Apellido" field="lastname" form={sForm} />
    <EmailInput
      label="Direccion de email"
      autocomplete={false}
      form={sForm}
      field="email"
    />
    <TelInput
      label="Telefono"
      form={sForm}
      field="phone"
      hint="Formato: 123-456-7890"
    />
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <slot name="actions">
      <SubmitButton>Contactar</SubmitButton>
    </slot>
  </svelte:fragment>
</FieldGroup>
