<script lang="ts">
  import { superForm, dateProxy } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import { dev } from '$app/environment';
  import { DogSex, DogSize } from '$lib/enums';
  import Form from '$lib/components/form/Form.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import DateInput from '$lib/components/form/DateInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';

  export let data;

  let breeds: { value: string; label: string }[] = [];
  for (const breed of data.breeds) {
    breeds.push({ value: breed.id, label: breed.name });
  }

  const { form, errors, constraints } = superForm(data.form);
  const birthdate = dateProxy(form, 'birthdate', { format: 'date' });
  const today = new Date()
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
</script>

<Form method="POST" action="?/register" enctype="multipart/form-data">
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class=" text-lg font-semibold leading-7 text-gray-900">Nuevo perro</h2>

    <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <TextInput
        label="Nombre"
        name="name"
        constraints={$constraints.name}
        bind:value={$form.name}
        errors={$errors.name}
      />
      <DateInput
        label="Nacimiento"
        name="birthdate"
        min="1980-01-01"
        max={today}
        constraints={$constraints.birthdate}
        bind:value={$birthdate}
        errors={$errors.birthdate}
      >
        <small class=" text-gray-400">
          Si se desconoce la fecha, ingrese la estimada
        </small>
      </DateInput>
      <TextInput
        label="Color"
        name="color"
        constraints={$constraints.color}
        bind:value={$form.color}
        errors={$errors.color}
      >
        <small class=" text-gray-400">
          Si no es de un color, una descripcion pequeña
        </small>
      </TextInput>
      <TextInput
        label="Observacion"
        name="observation"
        constraints={$constraints.observation}
        bind:value={$form.observation}
        errors={$errors.observation}
      />
      <SelectInput
        label="Tamaño"
        unselectedLabel="Sin seleccionar"
        name="size"
        constraints={$constraints.size}
        bind:value={$form.size}
        errors={$errors.size}
        options={[
          { value: DogSize.SMALL, label: 'Pequeño' },
          { value: DogSize.MEDIUM, label: 'Mediano' },
          { value: DogSize.BIG, label: 'Grande' },
        ]}
      />
      <SelectInput
        label="Sexo"
        unselectedLabel="Sin seleccionar"
        name="sex"
        constraints={$constraints.sex}
        bind:value={$form.sex}
        errors={$errors.sex}
        options={[
          { value: DogSex.FEMALE, label: 'Hembra' },
          { value: DogSex.MALE, label: 'Macho' },
        ]}
      />
      <SelectInput
        label="Raza"
        unselectedLabel="Sin seleccionar"
        name="breedId"
        constraints={$constraints.breedId}
        bind:value={$form.breedId}
        errors={$errors.breedId}
        options={breeds}
      />
      <ImageInput
        label="Imagen"
        name="image"
        constraints={$constraints.image}
        bind:value={$form.image}
        errors={$errors.image}
      />
      <input
        type="text"
        disabled={dev}
        name="ownerId"
        bind:value={$form.ownerId}
      />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SuperDebug data={$form} />
    {#if $errors._errors}
      {$errors._errors}
    {/if}
    <button
      type="button"
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
    >
      Cancelar</button
    >
    <SubmitButton>Registrar perro</SubmitButton>
  </div>
</Form>
