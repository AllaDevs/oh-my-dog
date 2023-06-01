<script lang="ts">
  import { PostState } from '$lib/enums.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  import TemporalDogForm from '$lib/components/dog/TemporalDogForm.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextAreaInput from '$lib/components/form/TextAreaInput.svelte';

  export let data;

  let breeds: { value: string; text: string }[] = [];
  for (const breed of data.breeds) {
    breeds.push({ value: breed.id, text: breed.name });
  }

  const deleteSForm = superForm(data.deleteForm, {
    id: 'delete',
    onResult: ({ result }) => {
      switch (result.type) {
        case 'redirect': {
          toast.success('Se elimino el post exitosamente', { duration: 3000 });
          break;
        }
        default:
          break;
      }
    },
  });

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Perro para adopción registrado con exito');
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

  let postIsResolved = data.post.state === PostState.RESOLVED;
  const resolveForm = superForm(data.resolveForm, {
    id: 'resolve',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se resolvio la adopcion con exito');
        postIsResolved = true;
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });
</script>

<svelte:head>
  <title>Post de adopcion</title>
</svelte:head>

<main
  id="main"
  class="container mx-auto flex max-w-screen-lg flex-col px-6 py-4"
>
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-2xl">Edicion post de adopcion</h2>
  </header>

  <article class="flex flex-col gap-8 px-4 justify-around lg:flex-row">
    <section class="flex flex-col gap-4">
      <form method="POST" action="?/update" use:updateSForm.enhance>
        <TemporalDogForm
          sForm={updateSForm}
          {breeds}
          readonly={data.post.registered}
        >
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              Informacion del perro
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="actions">
            {#if !data.post.registered}
              <SubmitButton disabled={postIsResolved}>Actualizar</SubmitButton>
            {/if}
          </svelte:fragment>
        </TemporalDogForm>
      </form>
      <form method="POST" action="?/resolve" use:deleteSForm.enhance>
        <FieldGroup cols={1}>
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              Resolver adopcion
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextAreaInput
              label="Valoracion"
              form={resolveForm}
              field="detail"
              readonly={postIsResolved}
            />
          </svelte:fragment>
          <svelte:fragment slot="actions">
            <SubmitButton disabled={postIsResolved}>Resolver</SubmitButton>
          </svelte:fragment>
        </FieldGroup>
      </form>
      {#if !postIsResolved}
        <form
          method="POST"
          action="?/delete"
          use:deleteSForm.enhance
          class="flex justify-end p-4"
        >
          <button
            type="submit"
            class="rounded-md bg-red-700/95 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Eliminar post
          </button>
        </form>
      {/if}
    </section>
  </article>
</main>
