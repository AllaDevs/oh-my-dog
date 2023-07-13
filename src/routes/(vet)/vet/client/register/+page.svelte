<script lang="ts">
  import { dev } from '$app/environment';
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import ClientRegisterCard from '$lib/components/vet/ClientRegisterCard.svelte';
  import DogRegisterCard from '$lib/components/vet/DogRegisterCard.svelte';
  import { breedsToInputOptions, fieldValueCloner } from '$lib/utils/functions';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  let breeds = breedsToInputOptions(data.breeds);

  const registerSForm = superForm(data.form, {
    dataType: 'json',
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Cliente registrado con exito', { duration: 3000 });
      }
    },
    onError: (error) => {
      toast.error(String(error.message), { duration: 5000 });
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cliente registrado con exito', { duration: 5000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 5000 });
      }
    },
  });
  const { form: registerData, errors } = registerSForm;

  const cloneDogDefault = fieldValueCloner($registerData, ['dogs', 0]);

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

<Page classContainer="container gap-4 p-4 lg:max-w-screen-lg mx-auto scrollbar">
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Registrar nuevo cliente</h2>
  </svelte:fragment>

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
      <Button formaction="?/client" on:click={addDog} color="success">
        Agregar otro perro
      </Button>
      <Button type="submit" formaction="?/client" color="primary">
        Registrar cliente
      </Button>
    </div>
  </form>

  {#if dev}
    <SuperDebug data={$registerData} />

    {#if $errors._errors}
      {$errors._errors}
    {/if}
  {/if}
</Page>
