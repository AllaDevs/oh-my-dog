<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import Form from '$lib/components/form/Form.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  export let data;

  const { form, errors, constraints, enhance } = superForm(data.form);
</script>

{#if $errors._errors}
  {$errors._errors}
{/if}

<div class=" mt-10 pb-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
  <div>
    <h2 class=" text-lg font-semibold leading-7 text-gray-900">
      Razas cargadas
    </h2>
    <ul class=" mt-6">
      {#each data.breeds as breed}
        <li class=" p-1 border-b border-y-cyan-900 border-opacity-25">
          <p>{breed.name}</p>
        </li>
      {:else}
        <li>
          <p>No hay razas cargadas</p>
        </li>
      {/each}
    </ul>
    <Form method="POST" action="?/registerTestBreeds" class=" mt-6">
      <SubmitButton>Cargar razas de prueba</SubmitButton>
    </Form>
  </div>
  <div>
    <Form method="POST" action="?/registerBreed" {enhance}>
      <h2 class=" text-lg font-semibold leading-7 text-gray-900">
        Cargar nueva raza
      </h2>
      <div class="mt-6 flex items-end gap-x-6">
        <TextInput
          label="Nombre de la raza"
          name="name"
          constraints={$constraints.name}
          bind:value={$form.name}
          errors={$errors.name}
        />
        <SubmitButton>Cargar</SubmitButton>
      </div>
      <SuperDebug data={$form} />
    </Form>
  </div>
</div>
