<script lang="ts">
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';
  import { page } from '$app/stores';
  
  import DogRegisterForm from '$lib/components/dog/DogRegisterForm.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import { breedsToInputOptions } from '$lib/utils/functions.js';

  export let data;

  let breeds = breedsToInputOptions(data.breeds);

  const registerSForm = superForm(data.form, {
    onError: (error) => {
      toast.error(String(error.message), { duration: 10000 });
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Perro registrado con exito', { duration: 3000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });
</script>

<svelte:head>
  <title>Registrar perro</title>
</svelte:head>

<main
  id="main"
  class="container mx-auto flex max-w-screen-lg flex-col px-6 py-4 pb-8"
>
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-2xl">Registrar perro</h2>
  </header>

  <article class="flex flex-col gap-8 px-4 justify-around lg:flex-row">
    <section class="flex flex-col">
      <DogRegisterForm action="?/register" sForm={registerSForm} {breeds}>
        <svelte:fragment slot="actions">
          <a
            href="/vet/client/{$page.params.client_id}"
            class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
          >
            Volver al cliente
          </a>
          <SubmitButton>Registrar</SubmitButton>
        </svelte:fragment>
      </DogRegisterForm>
    </section>
  </article>
</main>
