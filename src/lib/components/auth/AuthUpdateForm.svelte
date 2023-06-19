<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import EmailInput from '$cmp/form/EmailInput.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import PasswordInput from '$cmp/form/PasswordInput.svelte';
  import type { AccountAuthUpdateSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';

  export let action: string | undefined = undefined;
  export let sForm: SuperForm<AccountAuthUpdateSchema, unknown>;
  export let title: string | undefined = undefined;
  export let classContainer: string = '';
</script>

<form method="POST" {action} use:sForm.enhance class={classContainer}>
  <FieldGroup cols="2">
    <svelte:fragment slot="title">
      <slot name="title">
        <h3 class=" text-xl font-semibold text-gray-900">
          {title ?? 'Informacion de autenticacion'}
        </h3>
      </slot>
    </svelte:fragment>
    <svelte:fragment slot="fields">
      <EmailInput
        form={sForm}
        field="currentEmail"
        label="Direccion de email actual"
        autocomplete
      />
      <EmailInput
        form={sForm}
        field="newEmail"
        label="Nueva direccion de email"
      />
      <PasswordInput
        form={sForm}
        field="currentPassword"
        label="Contraseña actual"
      />
      <PasswordInput
        form={sForm}
        field="newPassword"
        label="Nueva contraseña"
      />
      <PasswordInput
        form={sForm}
        field="newPasswordConfirm"
        label="Confirmar nueva contraseña"
      />
    </svelte:fragment>
    <svelte:fragment slot="actions">
      <Button color="default" on:click={() => sForm.reset()}>
        Restablecer
      </Button>
      <Button type="submit" color="primary">Actualizar informacion</Button>
    </svelte:fragment>
  </FieldGroup>
</form>
