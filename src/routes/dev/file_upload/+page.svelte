<script lang="ts">
  import Form from '$lib/components/form/Form.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;

  const { form, constraints, errors, message } = superForm(data.form);
</script>

<Form
  method="POST"
  action="?/uploadSingleFile"
  enctype="multipart/form-data"
  class=" max-w-sm"
>
  <ImageInput
    label="Imagen"
    name="file"
    bind:value={$form.file}
    constraints={$constraints.file}
    errors={$errors.file}
  />

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <button
      type="submit"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      Upload file</button
    >
  </div>
</Form>

{#if $message}
  <div class="mt-6 flex items-center justify-around gap-x-6">
    <img src={$message} alt="test" />
  </div>
{/if}

<!-- <form method="POST" action="?/uploadMultipleFile" class=" max-w-sm mt-10">
  <div class="pb-4 grid grid-cols-1 gap-x-6 gap-y-8">
    <InputField label="Archivos" for="files">
      <input
        name="files"
        type="file"
        id="files"
        accept="image/jpeg, image/png, image/webp"
        multiple
        bind:value={$form.files}
        {...$constraints.files}
        data-invalid={$errors.files}
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
      />
      {#if $errors.files}
        <p class="mt-2 text-sm text-red-500">
          {$errors.files}
        </p>
      {/if}
    </InputField>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <button
      type="submit"
      class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      Upload files</button
    >
  </div>
</form> -->
