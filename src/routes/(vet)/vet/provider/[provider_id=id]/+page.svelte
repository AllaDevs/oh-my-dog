<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import StyledTextInput from '$cmp/styledInput/TextInput.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import TextAreaInput from '$lib/components/form/TextAreaInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { DogServiceType } from '$lib/enums';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const updateSForm = superForm(data.form, {
    onError: (error) => {
      toast.error(String(error.message));
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Proveedor modificado con exito', { duration: 5000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });

  let serviceType = updateSForm.fields.type.value;
</script>

<svelte:head>
  <title>Edición de proveedor</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="mt-10 mb-3 ml-12">
    <h3 class="text-3xl font-semibold text-gray-900">Edición de Proveedor</h3>
  </div>

  <main class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
    <form method="POST" class=" mt-2 py-4" use:updateSForm.enhance>
      <div class=" pb-4 flex flex-col gap-4">
        <FieldGroup cols="2">
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              Editar Proveedor
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextInput label="Nombre" field="firstname" form={updateSForm} />
            <TextInput label="Apellido" field="lastname" form={updateSForm} />
            <TextInput
              label="Email"
              field="email"
              form={updateSForm}
              readonly
            />
            <StyledTextInput
              label="Tipo"
              field="type"
              value={$serviceType === DogServiceType.SITTING
                ? 'Cuidador'
                : 'Paseador'}
              readonly
            />
            <TextAreaInput
              label="Areas"
              field="workAreas"
              form={updateSForm}
              placeholder="Detalle las areas en las que trabaja"
            />
            <TextAreaInput
              label="Horarios"
              field="workHours"
              form={updateSForm}
              placeholder="Detalle los horarios en los que trabaja"
            />
            <TextAreaInput
              label="Descripcion"
              field="description"
              form={updateSForm}
              placeholder="Ingrese una descripcion"
            />
          </svelte:fragment>
        </FieldGroup>
      </div>

      <div class="mt-6 flex items-center justify-around">
        <Button type="submit" formaction="?/delete" color="error">
          Eliminar Proveedor
        </Button>
        <Button type="submit" formaction="?/update" color="primary">
          Guardar Cambios
        </Button>
      </div>
    </form>
  </main>
</Page>
