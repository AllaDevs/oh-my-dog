<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  const sForm = superForm(data.form);
  const { errors, enhance } = sForm;
</script>

<svelte:head>
  <title>Restablecer contraseña - ¡Oh my dog!</title>
</svelte:head>

{#if $errors._errors}
  <p class="py-6 text-center text-sm font-semibold leading-5 text-red-500">
    Se produjo un error al actualizar la contraseña, intenta mas tarde
  </p>
{/if}

<h1 class="mt-6 text-center text-2xl font-semibold text-gray-800">
  Restablecer contraseña
</h1>

<form method="POST" use:enhance>
  <div class="mt-6">
    <PasswordInput
      label="Nueva contraseña"
      field="password"
      isNew={true}
      form={sForm}
    />
    <PasswordInput
      label="Confirmar nueva contraseña"
      field="passwordConfirm"
      isNew={true}
      form={sForm}
    />
  </div>

  <div class="mt-6 flex items-center justify-around">
    <SubmitButton>Cambiar contraseña</SubmitButton>
  </div>
</form>
