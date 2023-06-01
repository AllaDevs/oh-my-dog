<script lang="ts">
  import DayInput from '$lib/components/form/DayInput.svelte';
  import HourInput from '$lib/components/form/HourInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { DogServiceType } from '$lib/enums';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;
  const sForm = superForm(data.form, { dataType: 'json' });
  const { form, errors, constraints, message } = sForm;
</script>

<svelte:head>
  <title>Nuevo proveedor</title>
</svelte:head>

<form method="POST" class=" max-w-sm">
  <div class="border-b border-gray-900/10 pb-12">
    <div class="pb-4 grid grid-cols-1 gap-x-1 gap-y-3 m-10">
      <TextInput
        label="Nombre"
        field="username"
        unselectedLabel="Ingrese su nombre"
        form={sForm}
      />
      <TextInput
        label="Apellido"
        field="lastname"
        unselectedLabel="Ingrese su apellido"
        form={sForm}
      />
      <TextInput
        label="Email"
        field="email"
        unselectedLabel="Ingrese su email"
        form={sForm}
      />
      <SelectInput
        label="Tipo"
        field="type"
        unsetLabel="Seleccione un tipo"
        form={sForm}
        values={[
          { value: DogServiceType.SITTING, label: 'Cuidador' },
          { value: DogServiceType.WALKING, label: 'Paseador' },
        ]}
      />
      <TextInput
        label="Areas"
        field="areas"
        unselectedLabel="Describa las areas en las que trabaja"
        form={sForm}
      />
      <TextInput
        label="Descripcion"
        field="description"
        unselectedLabel="Ingrese una descripcion"
        form={sForm}
      />
    </div>
    <div>
      <p>Hora de trabajo:</p>
      <DayInput
        label="Dia"
        field={['workingHour', 0, 'day']}
        unselectedLabel="Día"
        form={sForm}
      />
      <HourInput
        label="Inicio"
        field={['workingHour', 0, 'start']}
        unselectedLabel="Hora de Inicio"
        form={sForm}
      />
      <HourInput
        label="end"
        field={['workingHour', 0, 'end']}
        unselectedLabel="Hora de fin"
        form={sForm}
      />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SubmitButton>Crear Proveedor</SubmitButton>
  </div>
  <div class="flex items-center justify-around mt-10 text-xl max-w-full">
    {#if $message}
      <p
        class="text-{$message === 'Proveedor creado de forma exitosa!'
          ? 'green-500'
          : 'red'}-500 text-sm font-semibold leading-5 mb-4 text-center"
      >
        {$message}
      </p>
    {/if}
  </div>
</form>
