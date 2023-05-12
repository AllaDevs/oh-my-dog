<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import InputField from '$lib/components/InputField.svelte';

  export let data: PageData;

  const { form, errors, constraints } = superForm(data.form);
  const breeds = data.breeds;
</script>

<SuperDebug data={$form} />

{#if $errors._errors}
  {$errors._errors}
{/if}
<form method="POST">
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">
        Nuevo veterinario
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <InputField label="Nombre de la raza" name="name">
          <input
            type="text"
            name="name"
            bind:value={$form.name}
            {...$constraints.name}
            data-invalid={$errors.name}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
      </div>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button type="button" class="text-sm font-semibold leading-6 text-gray-900">
      Cancelar</button
    >
    <button
      type="submit"
      formaction="/vet/admin/breed?/register"
      class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Crear</button
    >
  </div>
</form>

<form method="POST">
  <div class="mt-6 flex items-center justify-end gap-x-6">
    <button
      type="submit"
      formaction="/vet/admin/breed?/registerTestBreeds"
      class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Registrar razas prueba</button
    >
  </div>
</form>

<ul>
  {#each breeds as breed}
    <li>
      <p>{breed.name}</p>
    </li>
  {/each}
</ul>
