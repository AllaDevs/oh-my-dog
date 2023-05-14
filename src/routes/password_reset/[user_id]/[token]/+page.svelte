<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import type { PageData } from './$types';
  import InputField from '$lib/components/InputField.svelte';

  export let data: PageData;

  const { form, errors, constraints, enhance } = superForm(data.form);
</script>

{#if $errors._errors}
  <p class="text-red-500 text-sm font-semibold leading-5 mb-4">
    Se produjo un error al actualizar la contraseña, intenta mas tarde
  </p>
{/if}

<form method="POST" use:enhance class=" max-w-sm">
  <div class="space-y-12">
    <div class="mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
      <InputField label="Nueva contraseña" name="password">
        <input
          name="password"
          type="password"
          id="password"
          autocomplete="new-password"
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
      </InputField>

      <InputField label="Confirmar nueva contraseña" name="passwordConfirm">
        <input
          name="passwordConfirm"
          id="passwordConfirm"
          type="password"
          autocomplete="new-password"
          bind:value={$form.passwordConfirm}
          {...$constraints.passwordConfirm}
          data-invalid={$errors.passwordConfirm}
          class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
        />
        {#if $errors.passwordConfirm}
          <p class="mt-2 text-sm text-red-500">
            {$errors.passwordConfirm}
          </p>
        {/if}
      </InputField>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <a
      href="/login"
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      >¿Recuerdas la contraseña?</a
    >
    <button
      type="submit"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >Cambiar contraseña</button
    >
  </div>
</form>
