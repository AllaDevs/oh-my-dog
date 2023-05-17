<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import InputField from '$lib/components/InputField.svelte';

  export let data: PageData;

  const { form, errors, constraints } = superForm(data.form);
</script>

<SuperDebug data={$form} />

{#if $errors._errors}
  {$errors._errors}
{/if}

<form method="POST">
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">
        Nuevo cliente
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <InputField label="Nombre" for="ername">
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
        <InputField label="Apellido" for="lastname">
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
        <InputField label="Email" for="email">
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
        <InputField label="Nacimiento" for="birthdate">
          <input
            type="date"
            name="birthdate"
            bind:value={$form.birthdate}
            {...$constraints.birthdate}
            data-invalid={$errors.birthdate}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
        <InputField label="Telefono" for="phone">
          <input
            type="tel"
            name="phone"
            bind:value={$form.phone}
            {...$constraints.phone}
            data-invalid={$errors.phone}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <small class=" text-gray-400">Formato: 123-456-7890</small>
        </InputField>
      </div>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <button
      type="button"
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
    >
      Cancelar
    </button>
    <button
      type="submit"
      formaction="/vet/register?/client"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >Registrar cliente</button
    >
  </div>
</form>
