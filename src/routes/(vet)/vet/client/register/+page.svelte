<script lang="ts">
  import { dev } from '$app/environment';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import ClientRegisterFieldset from '$lib/components/vet/ClientRegisterFieldset.svelte';
  import DogRegisterFieldset from '$lib/components/vet/DogRegisterFieldset.svelte';

  import { fieldCloner } from '$lib/utils/functions';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  let breeds: { value: string; text: string }[] = [];
  for (const breed of data.breeds) {
    breeds.push({ value: breed.id, text: breed.name });
  }

  const registerSForm = superForm(data.form, {
    dataType: 'json',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cliente registrado con exito');
      }
    },
  });
  const { form: registerData, errors } = registerSForm;

  const cloneDogDefault = fieldCloner($registerData, ['dogs', 0]);

  function addDog() {
    $registerData.dogs.push(cloneDogDefault());
    $registerData.dogs = $registerData.dogs;
  }
</script>

<main class=" flex flex-col gap-4 p-4 max-w-md md:max-w-2xl mx-auto">
  {#if dev}
    <SuperDebug data={$registerData} />

    {#if $errors._errors}
      {$errors._errors}
    {/if}
  {/if}

  <form
    method="POST"
    class=" mt-2 py-4"
    enctype="multipart/form-data"
    use:registerSForm.enhance
  >
    <div class=" pb-12 flex flex-col gap-4">
      <ClientRegisterFieldset sForm={registerSForm} legend="Nuevo cliente" />
      {#each $registerData.dogs as _, i}
        {@const legend =
          $registerData.dogs.length > 1
            ? `Nuevo perro ${i + 1}`
            : 'Nuevo perro'}
        <DogRegisterFieldset
          sForm={registerSForm}
          index={i}
          {legend}
          {breeds}
        />
      {/each}
      <button
        type="button"
        on:click={addDog}
        class="rounded-md bg-teal-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
      >
        Agregar otro perro
      </button>
    </div>

    <div class="mt-6 flex items-center justify-around">
      <button
        type="button"
        on:click={() => registerSForm.reset()}
        class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      >
        Cancelar
      </button>
      <SubmitButton action="?/client">Registrar cliente</SubmitButton>
    </div>
  </form>
</main>
