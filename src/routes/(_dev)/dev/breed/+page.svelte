<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors, enhance } = sForm;
</script>

{#if $errors._errors}
  {$errors._errors}
{/if}

<div
  class=" mt-10 grid grid-cols-1 gap-x-6 gap-y-8 pb-4 sm:grid-cols-2 max-w-screen-md mx-auto"
>
  <div>
    <form method="POST" action="?/registerBreed" use:enhance>
      <h2 class=" text-xl font-semibold leading-7 text-gray-900">
        Cargar nueva raza
      </h2>
      <div class="mt-6 flex items-end gap-x-6">
        <TextInput label="Nombre de la raza" field="name" form={sForm} />
        <Button type="submit" color="primary">Cargar</Button>
      </div>
      <SuperDebug data={$form} />
    </form>
  </div>
  <div>
    <h2 class=" text-xl font-semibold leading-7 text-gray-900">
      Razas cargadas
    </h2>
    <ul class=" mt-6">
      {#each data.breeds as breed}
        <li class=" border-b border-y-cyan-900 border-opacity-25 p-1">
          <p>{breed.name}</p>
        </li>
      {:else}
        <li>
          <p>No hay razas cargadas</p>
        </li>
      {/each}
    </ul>
    <ActionButton action="?/registerDefaultBreeds" color="primary">
      Cargar razas defaults
    </ActionButton>
  </div>
</div>
