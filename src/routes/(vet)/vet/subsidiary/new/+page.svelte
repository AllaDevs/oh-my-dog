<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import WorkingHourRegisterCard from '$cmp/vet/WorkingHourRegisterCard.svelte';
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
        toast.success('Sucursal registrada con exito', { duration: 5000 });
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
  <title>Nueva sucursal</title>
  <src />
</svelte:head>

<Page>
  <div class="mt-10 mb-3 ml-12">
    <h3 class="text-3xl font-semibold text-gray-900">Registro de Proveedor</h3>
  </div>

  <main class=" container flex flex-col gap-4 p-4 lg:max-w-screen-lg mx-auto">
    <form
      method="POST"
      class=" mt-2 py-4"
      enctype="multipart/form-data"
      use:registerSForm.enhance
    >
      <div class=" pb-4 flex flex-col gap-4">
        <FieldGroup cols="2">
          <svelte:fragment slot="title">
            <h3 class=" text-xl font-semibold text-gray-900">
              {'Nuevo proveedor'}
            </h3>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextInput
              label="Nombre"
              field="name"
              unselectedLabel="Ingrese la calle"
              form={registerSForm}
            />
            <TextInput
              label="Calle"
              field="address"
              unselectedLabel="Ingrese el nombre"
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
      </button> -->
        <Button on:click={addWorkingHour} color="primary">
          Agregar otra franja horaria
        </Button>
        <Button type="submit" formaction="?/register" color="primary">
          Registrar sucursal
        </Button>
      </div>
    </form>
  </main>
</Page>
