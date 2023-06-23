<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import TextAreaInput from '$lib/components/form/TextAreaInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import WorkingHourRegisterCard from '$lib/components/vet/WorkingHourRegisterCard.svelte';
  import { DogServiceType } from '$lib/enums';
  import { fieldValueCloner } from '$lib/utils/functions.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;
  // enhanced
  const registerSForm = superForm(data.form, {
    dataType: 'json',
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
  const { form: registerData, errors } = registerSForm;

  const cloneHourDefault = fieldValueCloner($registerData, ['workingHour', 0]);

  function addWorkingHour() {
    $registerData.workingHour.push(cloneHourDefault());
    $registerData.workingHour = $registerData.workingHour;
  }

  function removeWorkingHour(index: number) {
    $registerData.workingHour.splice(index, 1);
    $registerData.workingHour = $registerData.workingHour;
  }
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
    <form
      method="POST"
      class=" mt-2 py-4"
      enctype="multipart/form-data"
      action="?/update"
      use:registerSForm.enhance
    >
      <div class=" pb-4 flex flex-col gap-4">
        <FieldGroup cols="2">
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              {'Editar Proveedor'}
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextInput
              label="Nombre"
              field="firstname"
              unselectedLabel="Ingrese su nombre"
              form={registerSForm}
            />
            <TextInput
              label="Apellido"
              field="lastname"
              unselectedLabel="Ingrese su apellido"
              form={registerSForm}
            />
            <TextInput
              label="Email"
              field="email"
              unselectedLabel="Ingrese su email"
              form={registerSForm}
              readonly={true}
              autocomplete="pruebas@gmail.com"
            />
            <SelectInput
              label="Tipo"
              field="type"
              unsetLabel="Seleccione un tipo"
              form={registerSForm}
              options={[
                { value: DogServiceType.SITTING, text: 'Cuidador' },
                { value: DogServiceType.WALKING, text: 'Paseador' },
              ]}
            />
            <TextAreaInput
              label="Areas"
              field="areas"
              unselectedLabel="Describa las areas en las que trabaja"
              form={registerSForm}
            />
            <TextAreaInput
              label="Descripcion"
              field="description"
              unselectedLabel="Ingrese una descripcion"
              form={registerSForm}
            />
          </svelte:fragment>
          <svelte:fragment slot="actions" />
        </FieldGroup>
        {#each $registerData.workingHour as _, i}
          <WorkingHourRegisterCard
            sForm={registerSForm}
            index={i}
            title="Nueva franja {$registerData.workingHour.length > 1
              ? i + 1
              : ''}"
            allowRemoval={i > 0}
            on:remove={() => removeWorkingHour(i)}
          />
        {/each}
      </div>

      <div class="mt-6 flex items-center justify-around">
        <!-- <button
        type="button"
        on:click={addWorkingHour}
        class=" mt-2 rounded-md bg-teal-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-teal-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
      >
        Agregar otra franja
      </button>
      <form action="?/delete">
        <button
          type="submit"
          class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >Eliminar Proveedor</button
        >
      </form> -->
        <Button on:click={addWorkingHour} color="primary">
          Agregar otra franja horaria
        </Button>
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
