<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import InputField from '$lib/components/InputField.svelte';

  export let data: PageData;

  const { form, errors, constraints } = superForm(data.form);
</script>

<form method="POST">
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">
        Nuevo veterinario
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <InputField label="Nombre" name="username">
          <input
            type="text"
            name="username"
            autocomplete="given-name"
            bind:value={$form.username}
            {...$constraints.username}
            data-invalid={$errors.username}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
        <InputField label="Apellido" name="lastname">
          <input
            type="text"
            name="lastname"
            autocomplete="family-name"
            bind:value={$form.lastname}
            {...$constraints.lastname}
            data-invalid={$errors.lastname}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
        <InputField label="Email" name="email">
          <input
            type="email"
            name="email"
            autocomplete="email"
            bind:value={$form.email}
            {...$constraints.email}
            data-invalid={$errors.email}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
        <InputField label="Contraseña" name="password">
          <input
            type="password"
            name="password"
            autocomplete="new-password"
            bind:value={$form.password}
            {...$constraints.password}
            data-invalid={$errors.password}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
      </div>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-end gap-x-6">
    <div class="flex flex-col">
      <SuperDebug data={$form} />
      {#if $errors._errors}
        {$errors._errors}
      {/if}
    </div>

    <button
      type="submit"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >Registrar veterinario</button
    >
  </div>
</form>

<!-- <div class=" flex justify-end p-4">
  <form method="post">
    <button
      class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
      formaction="/vet/admin/cleardb"
      type="submit">Cerrar Sesión</button
    >
  </form>
</div> -->
