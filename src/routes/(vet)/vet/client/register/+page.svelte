<script lang="ts">
  import { dev } from '$app/environment';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import ClientRegisterCard from '$lib/components/vet/ClientRegisterCard.svelte';
  import DogRegisterCard from '$lib/components/vet/DogRegisterCard.svelte';

  import { createFieldCopier } from '$lib/utils/functions';
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
    onError: (error) => {
      toast.error(String(error.message));
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cliente registrado con exito', { duration: 5000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });
  const { form: registerData, errors } = registerSForm;

  const cloneDogDefault = createFieldCopier($registerData, ['dogs', 0]);

  function addDog() {
    $registerData.dogs.push(cloneDogDefault());
    $registerData.dogs = $registerData.dogs;
  }

  function removeDog(index: number) {
    $registerData.dogs.splice(index, 1);
    $registerData.dogs = $registerData.dogs;
  }
</script>

<svelte:head>
  <title>Registrar cliente</title>
</svelte:head>

<main class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
  <form
    method="POST"
    class=" mt-2 py-4"
    enctype="multipart/form-data"
    use:registerSForm.enhance
  >
    <div class=" pb-4 flex flex-col gap-4">
      <ClientRegisterCard sForm={registerSForm} title="Nuevo cliente" />
      {#each $registerData.dogs as _, i}
        <DogRegisterCard
          sForm={registerSForm}
          index={i}
          title="Nuevo perro {$registerData.dogs.length > 1 ? i + 1 : ''}"
          {breeds}
          allowRemoval={i > 0}
          on:remove={() => removeDog(i)}
        />
      {/each}
    </div>

    <div class="mt-6 flex items-center justify-around">
      <button
        type="button"
        on:click={addDog}
        class=" mt-2 rounded-md bg-teal-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
      >
        Agregar otro perro
      </button>
      <SubmitButton action="?/client">Registrar cliente</SubmitButton>
    </div>
  </form>

  {#if dev}
    <SuperDebug data={$registerData} />

    {#if $errors._errors}
      {$errors._errors}
    {/if}
  {/if}
</main>
