<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Form from '$lib/components/form/Form.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  const { form, errors, constraints, enhance } = superForm(data.form);
</script>

{#if $errors._errors}
  <p class="text-red-500 text-sm font-semibold leading-5 mb-4">
    Se produjo un error al actualizar la contraseña, intenta mas tarde
  </p>
{/if}

<Form method="POST" {enhance} class=" max-w-sm">
  <div class="mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
    <PasswordInput
      label="Nueva contraseña"
      name="password"
      isNew={true}
      constraints={$constraints.password}
      bind:value={$form.password}
      errors={$errors.password}
    />
    <PasswordInput
      label="Confirmar nueva contraseña"
      name="passwordConfirm"
      isNew={true}
      constraints={$constraints.passwordConfirm}
      bind:value={$form.passwordConfirm}
      errors={$errors.passwordConfirm}
    />
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <a
      href="/login"
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      >¿Recuerdas la contraseña?</a
    >
    <SubmitButton>Cambiar contraseña</SubmitButton>
  </div>
</Form>
