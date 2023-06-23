<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import EmailInput from '$cmp/form/EmailInput.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import TelInput from '$cmp/form/TelInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import type { ContactBaseSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';

  type T = $$Generic<ContactBaseSchema>;

  export let sForm: SuperForm<ContactBaseSchema, unknown>;
</script>

<FieldGroup cols="2">
  <svelte:fragment slot="title">
    <slot name="title">
      <h3 class=" text-lg font-semibold text-gray-900">
        Formulario de contacto
      </h3>
    </slot>
  </svelte:fragment>

  <svelte:fragment slot="fields">
    <TextInput label="Nombre" field="firstname" form={sForm} />
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
      <Button type="submit" color="primary">Contactar</Button>
    </slot>
  </svelte:fragment>
</FieldGroup>
