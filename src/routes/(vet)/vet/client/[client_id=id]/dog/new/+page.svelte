<script lang="ts">
  import { page } from '$app/stores';
  import Page from '$cmp/layout/Page.svelte';
  import DogRegisterForm from '$lib/components/dog/DogRegisterForm.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import { breedsToInputOptions } from '$lib/utils/functions.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let breeds = breedsToInputOptions(data.breeds);

  const registerSForm = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Perro registrado con exito', { duration: 3000 });
      }
    },
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

<Page
  classContainer="container mx-auto max-w-screen-lg px-6 py-4 pb-8"
  classHeaderSlot="py-2"
  classContentSlot=" mt-4 px-4"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Registrar perro</h2>
  </svelte:fragment>

  <section class="flex flex-col">
    <DogRegisterForm action="?/register" sForm={registerSForm} {breeds}>
      <svelte:fragment slot="actions">
        <a
          href="/vet/client/{$page.params.client_id}"
          class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold underline-offset-2 hover:underline text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
        >
          Volver al cliente
        </a>
        <SubmitButton>Registrar</SubmitButton>
      </svelte:fragment>
    </DogRegisterForm>
  </section>
</Page>
