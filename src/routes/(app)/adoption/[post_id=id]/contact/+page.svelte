<script lang="ts">
  import { enhance } from '$app/forms';
  import ContactCard from '$lib/components/client/ContactCard.svelte';
  import AdoptionPostInfo from '$lib/components/dog/AdoptionPostInfo.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import type { SubmitFunction } from '@sveltejs/kit';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const contactSForm = superForm(data.form, {
    id: 'anonymous',
    onError: (error) => {
      toast.error(String(error.message));
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Dueño contactado con exito', { duration: 5000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });

  const enhanceClientContact = (() => {
    return async ({ result }) => {
      switch (result.type) {
        case 'success': {
          toast.success('Dueño contactado con exito', { duration: 5000 });
          break;
        }
        case 'failure': {
          toast.error(
            String(
              result.data?.form.errors._errors ??
                'Ocurrio un error inesperado al registrar el perro para adopcion'
            )
          );
          break;
        }
        case 'error': {
          toast.error(String(result.error));
          break;
        }
      }
    };
  }) satisfies SubmitFunction;
</script>

<svelte:head>
  <title>Post de adopcion</title>
</svelte:head>

<main id="main" class="container mx-auto flex max-w-fit flex-col px-6 py-4">
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-3xl">Adoptar perro</h2>
  </header>

  <article class="flex flex-col gap-8 px-4 justify-around">
    <section class="flex flex-col gap-4">
      <h3 class="mt-4 text-xl font-bold">Informacion de la publicacion</h3>
      <AdoptionPostInfo post={data.post} />
    </section>

    <section class="flex flex-col gap-4">
      <h3 class="mt-4 text-xl font-bold">¿Quieres contactarlo?</h3>
      {#if data.user}
        <form
          method="POST"
          action="?/clientContact"
          use:enhance={enhanceClientContact}
        >
          <div class="grid place-items-center">
            <SubmitButton>Contactar</SubmitButton>
          </div>
        </form>
      {:else}
        <form
          method="POST"
          action="?/anonymousContact"
          use:contactSForm.enhance
        >
          <ContactCard sForm={contactSForm} />
        </form>
      {/if}
    </section>
  </article>
</main>
