<script lang="ts">
  import { page } from '$app/stores';
  import { superForm } from 'sveltekit-superforms/client';
  import Form from '$lib/components/form/Form.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  const { form, errors, constraints, enhance } = superForm(data.form);
  $: authorizationMessage = $page.url.searchParams.get('message') ?? '';

  let noAccountHelp = false;
</script>

<main id="main" class="mx-auto">
  {#if authorizationMessage}
    <p class="mb-4 text-sm font-semibold leading-5 text-red-500">
      {authorizationMessage}
    </p>
  {/if}
  <Form method="POST" {enhance} class=" mx-auto max-w-sm">
    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 pb-4">
      <EmailInput
        label="Direccion de email"
        name="email"
        constraints={$constraints.email}
        bind:value={$form.email}
        errors={$errors.email}
      />
      <PasswordInput
        label="Contraseña"
        name="password"
        isNew={true}
        autocomplete={true}
        constraints={$constraints.password}
        bind:value={$form.password}
        errors={$errors.password}
      >
        <div class="mt-2 text-sm">
          <a
            href="/password_reset"
            class="font-medium text-gray-500 hover:text-gray-800"
            >¿Olvidaste tu contraseña?</a
          >
        </div>
      </PasswordInput>
    </div>

    <div class="mt-6 flex items-center justify-around gap-x-6">
      <button
        type="button"
        class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
        on:click={() => (noAccountHelp = !noAccountHelp)}
      >
        ¿No tienes una cuenta?</button
      >
      <SubmitButton>Iniciar Sesión</SubmitButton>
    </div>

    <p
      class="mt-10 w-full px-6 text-center text-sm text-gray-600 opacity-0"
      style:opacity={noAccountHelp ? 1 : 0}
      style="transition: opacity 0.3s ease-in-out;"
    >
      Para crear una cuenta dirigete hacia una sucursal de la veterinaria con
      uno de tus perros, alli te registraran y te daran un usuario y contraseña.
    </p>
  </Form>
</main>
