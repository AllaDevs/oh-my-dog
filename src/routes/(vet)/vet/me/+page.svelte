<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import Fieldset from '$lib/components/form/Fieldset.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const accountSForm = superForm(data.accountForm, { id: 'accountForm' });

  const accountAuthSForm = superForm(data.accountAuthForm, {
    id: 'accountAuthForm',
    invalidateAll: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cuenta actualizada con exito', { duration: 3000 });
      } else {
        if (form.errors._errors) {
          toast.error(String(form.errors._errors), { duration: 5000 });
        }
      }
    },
  });
</script>

<svelte:head>
  <title>Cuenta administrativa</title>
</svelte:head>

<Page classContainer="container mx-auto px-6 py-4" classContentSlot="py-2">
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Mi cuenta</h2>
  </svelte:fragment>

  <form method="POST" class=" mt-2 py-4" use:accountAuthSForm.enhance>
    <div class=" flex flex-col gap-8">
      <Fieldset disabled={true}>
        <svelte:fragment slot="legend">Datos personales</svelte:fragment>
        <svelte:fragment slot="fields">
          <TextInput form={accountSForm} field={'username'} label="Nombre" />
          <TextInput form={accountSForm} field={'lastname'} label="Apellido" />
        </svelte:fragment>
      </Fieldset>
      <Fieldset>
        <svelte:fragment slot="legend">Datos de autenticacion</svelte:fragment>
        <svelte:fragment slot="fields">
          <EmailInput
            form={accountAuthSForm}
            field={'currentEmail'}
            label="Direccion de email actual"
          />
          <EmailInput
            form={accountAuthSForm}
            field={'newEmail'}
            label="Nueva direccion de email"
          />
          <PasswordInput
            form={accountAuthSForm}
            field={'currentPassword'}
            label="Contraseña actual"
          />
          <PasswordInput
            form={accountAuthSForm}
            field={'newPassword'}
            label="Nueva contraseña"
          />
          <PasswordInput
            form={accountAuthSForm}
            field={'newPasswordConfirm'}
            label="Confirmar nueva contraseña"
          />
        </svelte:fragment>
        <svelte:fragment slot="actions">
          <div class="mt-6 flex items-center justify-around">
            <button
              type="button"
              on:click={() => accountAuthSForm.reset()}
              class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
            >
              Cancelar
            </button>
            <SubmitButton action="?/authUpdate">Editar cuenta</SubmitButton>
          </div>
        </svelte:fragment>
      </Fieldset>
    </div>
  </form>
</Page>
