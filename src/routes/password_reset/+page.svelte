<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import InputField from '$lib/components/InputField.svelte';

  export let data: PageData;

  const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<form method="POST" use:enhance class=" max-w-sm">
  <div class="space-y-12">
    <div class="mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
      <InputField label="Email" for="email">
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
        <div class="mt-2">
          <a
            href="/login"
            class="text-sm font-medium text-gray-500 hover:text-gray-800"
            >¿Recuerdas la contraseña?</a
          >
        </div>
      </InputField>
    </div>
  </div>

  <div class="mt-4 grid place-items-center">
    <button
      type="submit"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >Enviar email de restableciemiento</button
    >
  </div>

  <p
    class="mt-10 px-6 text-sm text-gray-600 w-full text-center w-sm"
    style:opacity={$message ? 1 : 0}
    style="transition: opacity 0.3s ease-in-out;"
  >
    El email de restablecimiento ha sido enviado a <b>{$form.email}</b>, revisa
    tu bandeja de entrada.
  </p>
</form>
