<script lang="ts">
  import { page } from '$app/stores';
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import InputField from '$lib/components/InputField.svelte';

  export let data: PageData;

  const { form, errors, constraints } = superForm(data.form);
  $: authorizationMessage = $page.url.searchParams.get('message') ?? '';

  let noAccountHelp = false;
</script>

{#if authorizationMessage}
  <p class="text-red-500 text-sm font-semibold leading-5 mb-4">
    {authorizationMessage}
  </p>
{/if}

<form method="POST" class=" max-w-sm">
  <div class=" space-y-6">
    <div class="mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
      <InputField label="Direccion de email" for="email">
        <input
          name="email"
          type="email"
          id="email"
          autocomplete="email"
          bind:value={$form.email}
          {...$constraints.email}
          data-invalid={$errors.email}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
        />
        {#if $errors.email}
          <p class="mt-2 text-sm text-red-500">
            {$errors.email}
          </p>
        {/if}
      </InputField>
      <InputField label="Contraseña" for="password">
        <input
          type="password"
          name="password"
          id="password"
          autocomplete="current-password"
          bind:value={$form.password}
          {...$constraints.password}
          data-invalid={$errors.password}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
        />
        {#if $errors.password}
          <p class="mt-2 text-sm text-red-500">
            {$errors.password}
          </p>
        {/if}
        <div class="text-sm mt-2">
          <a
            href="/password_reset"
            class="font-medium text-gray-500 hover:text-gray-800"
            >¿Olvidaste tu contraseña?</a
          >
        </div>
      </InputField>
    </div>

    <div class="mt-6 flex items-center justify-around gap-x-6">
      <button
        type="button"
        class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
        on:click={() => (noAccountHelp = !noAccountHelp)}
      >
        ¿No tienes una cuenta?</button
      >
      <button
        type="submit"
        class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        Iniciar Sesion</button
      >
    </div>

    <p
      class="mt-10 px-6 text-sm text-gray-600 w-full text-center opacity-0"
      style:opacity={noAccountHelp ? 1 : 0}
      style="transition: opacity 0.3s ease-in-out;"
    >
      Para crear una cuenta dirigete hacia una sucursal de la veterinaria con
      uno de tus perros, alli te registraran y te daran un usuario y contraseña.
    </p>
  </div>
</form>
