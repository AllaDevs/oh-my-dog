<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import InputField from '$lib/components/InputField.svelte';
  import { DogSex, DogSize } from '@prisma/client';

  export let data: PageData;

  const { form, errors, constraints } = superForm(data.form);
</script>


<form method="POST">
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">
        Nuevo perro
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <InputField label="Nombre" name="name">
          <input
            type="text"
            name="name"
            bind:value={$form.name}
            {...$constraints.name}
            data-invalid={$errors.name}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
        <InputField label="Nacimiento" name="birthdate">
          <input
            type="date"
            name="birthdate"
            bind:value={$form.birthdate}
            {...$constraints.birthdate}
            data-invalid={$errors.birthdate}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
        <InputField label="Color" name="color">
          <input
            type="text"
            name="color"
            bind:value={$form.color}
            {...$constraints.color}
            data-invalid={$errors.color}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <small class=" text-gray-400">Ejemplo: cafe con manchas negras</small>
        </InputField>
        <InputField label="Observacion" name="observation">
          <input
            type="text"
            name="observation"
            bind:value={$form.observation}
            {...$constraints.observation}
            data-invalid={$errors.observation}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField>
        <InputField label="Tamaño" name="size">
          <select
            name="size"
            bind:value={$form.size}
            {...$constraints.size}
            data-invalid={$errors.size}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value={DogSize.SMALL}>Pequeño</option>
            <option value={DogSize.MEDIUM} selected>Mediano</option>
            <option value={DogSize.BIG}>Grande</option>
          </select>
        </InputField>
        <InputField label="Sexo" name="sex">
          <select
            name="sex"
            bind:value={$form.sex}
            {...$constraints.sex}
            data-invalid={$errors.sex}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value={DogSex.FEMALE}>Hembra</option>
            <option value={DogSex.MALE} selected>Macho</option>
          </select>
        </InputField>
        <InputField label="Raza" name="breedId">
          <select
            name="breedId"
            bind:value={$form.breedId}
            {...$constraints.breedId}
            data-invalid={$errors.breedId}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            {#each data.breeds as breed}
              <option value={breed.id}>{breed.name}</option>
            {/each}
          </select>
        </InputField>
        <!-- <InputField label="Imagen" name="image">
          <input
            type="file"
            name="image"
            disabled
            bind:value={$form.image}
            {...$constraints.image}
            data-invalid={$errors.image}
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </InputField> -->
        <input type="text" name="ownerId" bind:value={$form.ownerId} />
      </div>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SuperDebug data={$form} />
    {#if $errors._errors}
      {$errors._errors}
    {/if}
    <button
      type="button"
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
    >
      Cancelar</button
    >
    <button
      type="submit"
      formaction="/vet/register/{$form.ownerId}?/register"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >Registrar perro</button
    >
  </div>
</form>
