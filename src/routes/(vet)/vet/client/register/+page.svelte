<script lang="ts">
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import ClientDogForm from '$lib/components/vet/ClientDogForm.svelte';
    import ClientDogFormIndexed from '$lib/components/vet/ClientDogFormIndexed.svelte';
  import ClientForm from '$lib/components/vet/ClientForm.svelte';
  import toast from 'svelte-french-toast';
  import {copyFactory} from '$lib/utils/functions';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  let breeds: { value: string; text: string }[] = [];
  for (const breed of data.breeds) {
    breeds.push({ value: breed.id, text: breed.name });
  }

  

  const clientSuperForm = superForm(data.form, {
    dataType: 'json',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cliente registrado con exito');
      }
    },
  });
  const { form: formStore, errors } = clientSuperForm;
  const dogCopy = copyFactory($formStore, ['dogs', 0]);
  function addDog() {
    $formStore.dogs.push(dogCopy())
    $formStore.dogs = $formStore.dogs
  }
</script>

<main class=" flex flex-col gap-4 p-4 max-w-md md:max-w-2xl mx-auto">
  <SuperDebug data={$formStore} />

  {#if $errors._errors}
    {$errors._errors}
  {/if}

  <form
    method="POST"
    class=" mt-2 py-4"
    enctype="multipart/form-data"
    use:clientSuperForm.enhance
  >
    <div class=" pb-12 flex flex-col gap-4">
      <ClientForm sForm={clientSuperForm} />

      {#each $formStore.dogs as _, i}
        <ClientDogFormIndexed sForm={clientSuperForm} index={i} {breeds} />
      {/each}
      <button
        type="button"
        on:click={addDog}
        class="rounded-md bg-teal-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
      >
        Agregar perro
      </button>
    </div>

    <div class="mt-6 flex items-center justify-around">
      
      <button
        type="button"
        on:click={() => clientSuperForm.reset()}
        class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      >
        Cancelar
      </button>
      <SubmitButton action="?/client">Registrar cliente</SubmitButton>
    </div>
  </form>
</main>
