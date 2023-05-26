<script lang="ts">
  import { page } from '$app/stores';
  import { superForm } from 'sveltekit-superforms/client';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  const sForm = superForm(data.form);
  const { errors, enhance } = sForm;

  $: authorizationMessage = $page.url.searchParams.get('message') ?? '';

  let noAccountHelp = false;
</script>

<svelte:head>
  <title>Iniciar sesión - ¡Oh my dog!</title>
</svelte:head>

{#if authorizationMessage}
  <p class="py-6 text-center text-sm font-semibold leading-5 text-red-500">
    {authorizationMessage}
  </p>
{/if}

<h1 class="mt-6 text-center text-2xl font-semibold text-gray-800">
  Iniciar sesión
</h1>

<form method="POST" use:enhance>
  <div class="mt-6">
    <EmailInput label="Direccion de email" form={sForm} field="email" />
    <PasswordInput
      label="Contraseña"
      isNew={true}
      form={sForm}
      field="password"
    >
      <a
        href="/password_reset"
        slot="belowInput"
        class="text-sm font-medium text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline"
        >¿Olvidaste tu contraseña?</a
      >
    </PasswordInput>
  </div>

  <div class=" mt-6 flex items-center justify-around gap-x-6">
    <button
      type="button"
      class=" rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      on:click={() => (noAccountHelp = !noAccountHelp)}
    >
      ¿No tienes una cuenta?
    </button>
    <SubmitButton>Iniciar Sesión</SubmitButton>
  </div>

  <p
    class="mt-10 w-full px-6 text-center text-sm text-gray-600 opacity-0"
    style:opacity={noAccountHelp ? 1 : 0}
    style="transition: opacity 0.3s ease-in-out;"
  >
    Para crear una cuenta dirigete hacia una sucursal de la veterinaria con uno
    de tus perros, alli te registraran y te daran un usuario y contraseña.
  </p>
</form>
