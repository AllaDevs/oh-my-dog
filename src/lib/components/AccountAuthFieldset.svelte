<script lang="ts">
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import Fieldset from '$lib/components/form/Fieldset.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  import type { UnwrapEffects } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';

  type T = $$Generic<AnyZodObject>;

  export let sForm: SuperForm<UnwrapEffects<T>, unknown>;
  export let legend: string = 'Datos de autenticacion';
  export let action: string | undefined = undefined;
  export let submitLabel: string = 'Actualizar autenticacion';
</script>

<Fieldset>
  <svelte:fragment slot="legend">
    {legend}
  </svelte:fragment>
  <svelte:fragment slot="fields">
    <EmailInput
      form={sForm}
      field={'currentEmail'}
      label="Direccion de email actual"
    />
    <EmailInput
      form={sForm}
      field={'newEmail'}
      label="Nueva direccion de email"
    />
    <PasswordInput
      form={sForm}
      field={'currentPassword'}
      label="Contraseña actual"
    />
    <PasswordInput
      form={sForm}
      field={'newPassword'}
      label="Nueva contraseña"
    />
    <PasswordInput
      form={sForm}
      field={'newPasswordConfirm'}
      label="Confirmar nueva contraseña"
    />
  </svelte:fragment>
  <svelte:fragment slot="actions">
    <div class="mt-6 flex items-center justify-around">
      <button
        type="button"
        on:click={() => sForm.reset()}
        class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      >
        Cancelar
      </button>
      <SubmitButton {action}>
        {submitLabel}
      </SubmitButton>
    </div>
  </svelte:fragment>
</Fieldset>
