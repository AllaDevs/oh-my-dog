<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import SelectInput from '$cmp/form/SelectInput.svelte';
  import TextAreaInput from '$cmp/form/TextAreaInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { DogServiceType } from '$lib/enums';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const registerSForm = superForm(data.form, {
    onError: (error) => {
      toast.error(String(error.message));
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Proveedor registrado con exito', { duration: 5000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });
</script>

<svelte:head>
  <title>Nuevo proveedor</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="mt-10 mb-3 ml-12">
    <h3 class="text-3xl font-semibold text-gray-900">Registro de Proveedor</h3>
  </div>

  <main class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
    <form method="POST" class=" mt-2 py-4" use:registerSForm.enhance>
      <div class=" pb-4 flex flex-col gap-4">
        <FieldGroup cols="2">
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              Nuevo proveedor
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextInput label="Nombre" field="firstname" form={registerSForm} />
            <TextInput label="Apellido" field="lastname" form={registerSForm} />
            <TextInput label="Email" field="email" form={registerSForm} />
            <SelectInput
              label="Tipo"
              field="type"
              form={registerSForm}
              unselectedText="Seleccione un tipo"
              options={[
                { value: DogServiceType.SITTING, text: 'Cuidador' },
                { value: DogServiceType.WALKING, text: 'Paseador' },
              ]}
            />
            <TextAreaInput
              label="Areas"
              field="workAreas"
              form={registerSForm}
              placeholder="Detalle las areas en las que trabaja"
            />
            <TextAreaInput
              label="Horarios"
              field="workHours"
              form={registerSForm}
              placeholder="Detalle los horarios en los que trabaja"
            />
            <TextAreaInput
              label="Descripcion"
              field="description"
              form={registerSForm}
              placeholder="Descripcion del servicio"
            />
          </svelte:fragment>
        </FieldGroup>
      </div>

      <div class="mt-6 flex items-center justify-around">
        <Button type="submit" formaction="?/provider" color="primary">
          Registrar proveedor
        </Button>
      </div>
    </form>
  </main>
</Page>
