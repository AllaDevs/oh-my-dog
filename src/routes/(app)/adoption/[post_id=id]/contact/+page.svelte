<script lang="ts">
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  import ContactCard from '$lib/components/client/ContactCard.svelte';
  import AdoptionPostInfo from '$lib/components/dog/AdoptionPostInfo.svelte';

  export let data;

  const contactForm = superForm(data.anonymousForm, {
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
</script>

<svelte:head>
  <title>Post de adopcion</title>
</svelte:head>

<main
  id="main"
  class="container mx-auto flex max-w-fit flex-col px-6 py-4"
>
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
      <form
        method="POST"
        action="?/anonymousContact"
        use:contactForm.enhance
      >
        <ContactCard sForm={contactForm} />
      </form>
    </section>
  </article>
</main>
