<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import TextAreaInput from '$lib/components/form/TextAreaInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const registerSForm = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Campaña registrada con exito', { duration: 3000 });
      }
    },
    onError: (error) => {
      toast.error(String(error.message), { duration: 10000 });
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Campaña registrada con exito', { duration: 3000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });
</script>

<svelte:head>
  <title>Registrar campaña de donacion</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 max-w-screen-sm"
  classContentSlot="px-4 py-2"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Registrar campaña de donacion</h2>
  </svelte:fragment>

  <section class="flex flex-col mt-8">
    <form
      method="POST"
      action="?/register"
      enctype="multipart/form-data"
      use:registerSForm.enhance
    >
      <FieldGroup cols="1">
        <svelte:fragment slot="title">
          <slot name="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              Informacion de la campaña
            </h3>
          </slot>
        </svelte:fragment>

        <svelte:fragment slot="fields">
          <TextInput label="Nombre" form={registerSForm} field="name" />
          <TextAreaInput
            label="Descripcion"
            form={registerSForm}
            field="description"
          />
          <ImageInput label="Imagen" form={registerSForm} field="banner" />
        </svelte:fragment>

        <svelte:fragment slot="actions">
          <A href="/vet/donation" color="default" button>
            Volver a las campañas
          </A>
          <Button type="submit" color="primary">Registrar</Button>
        </svelte:fragment>
      </FieldGroup>
    </form>
  </section>
</Page>
