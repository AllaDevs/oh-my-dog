<script lang="ts">
  import TemporalDogForm from '$cmp/dog/TemporalDogForm.svelte';
  import Button from '$cmp/element/Button.svelte';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import TextAreaInput from '$cmp/form/TextAreaInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { PostState } from '$lib/enums.js';
  import { breedsToInputOptions } from '$lib/utils/functions.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let breeds = breedsToInputOptions(data.breeds);

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se actualizo el post exitosamente', { duration: 3000 });
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
        toast.success('Se resolvio la adopcion con exito', { duration: 3000 });
        postIsResolved = true;
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

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
</script>

<svelte:head>
  <title>Post de adopcion</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg p-4"
  classHeaderSlot="mt-2"
  classContentSlot="p-4 flex flex-col gap-4"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-3xl">
      Edicion post de adopcion {postIsResolved ? '(Resuelto)' : ''}
    </h2>
  </svelte:fragment>

  <form method="POST" action="?/update" use:updateSForm.enhance>
    <TemporalDogForm sForm={updateSForm} {breeds} readonly={postIsResolved}>
      <svelte:fragment slot="title">
        <h3 class=" text-xl font-semibold text-gray-900">
          Informacion del perro
        </h3>
      </svelte:fragment>
      <svelte:fragment slot="actions">
        {#if !data.post.registered}
          <Button type="submit" disabled={postIsResolved} color="primary">
            Actualizar
          </Button>
        {/if}
      </svelte:fragment>
    </TemporalDogForm>
  </form>

  <form method="POST" action="?/resolve" use:deleteSForm.enhance>
    <FieldGroup cols="1">
      <svelte:fragment slot="title">
        <h3 class=" text-xl font-semibold text-gray-900">Resolver adopcion</h3>
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
        {#if !postIsResolved}
          <Button type="submit" disabled={postIsResolved} color="success">
            Resolver
          </Button>
        {/if}
      </svelte:fragment>
    </FieldGroup>
  </form>

  {#if !postIsResolved}
    <ActionButton action="?/delete" enhance={deleteSForm.enhance} color="error">
      Eliminar publicacion
    </ActionButton>
  {/if}
</Page>
