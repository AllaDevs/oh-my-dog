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
    onSubmit: (input) => {
      // NETLIFY: temporary fix because of size limit in request body ~6MB
      let file = (input.formElement[2] as HTMLInputElement | null)?.files?.item(
        0
      );
      if (file && file.size > 4000000) {
        alert(
          'La imagen seleccionada es demasiado grande, por favor seleccione una imagen de menos de 4MB (4 Megabytes)'
        );
        input.cancel();
      }
    },
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Campaña registrada con exito', { duration: 3000 });
      }
    },
    onError: (error) => {
      toast.error(
        `Ocurrio un error inesperado durante la creacion de la campaña, intenta cambiando de imagen o mas tarde`,
        { duration: 5000 }
      );
      console.error(
        `Error during form submission at vet/donation/campaign/new/+page.svelte, result:\n${error.result}`
      );
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Campaña registrada con exito', { duration: 3000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 5000 });
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
