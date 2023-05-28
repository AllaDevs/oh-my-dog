<script lang="ts">
  import { dev } from '$app/environment';
  import DateInput from '$lib/components/form/DateInput.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { DogSex, DogSize } from '$lib/enums';
  import { dateProxy, superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  let breeds: { value: string; label: string }[] = [];
  for (const breed of data.breeds) {
    breeds.push({ value: breed.id, label: breed.name });
  }

  const sForm = superForm(data.form);
  const { form, errors, constraints } = sForm;
  const birthdate = dateProxy(form, 'birthdate', { format: 'date' });

  const today = new Date()
    .toISOString()
    .split('T')[0] as `${number}-${number}-${number}`;
</script>

<form method="POST" action="?/register" enctype="multipart/form-data">
  <div
    class="border-b border-gray-900/10 pb-12 flex items-center justify-around"
  >
    <h2 class=" text-lg font-semibold leading-7 text-gray-900">Nuevo perro</h2>

    <div
      class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 flex items-center justify-around"
    >
      <TextInput label="Nombre" field="name" form={sForm} />
      <DateInput
        label="Nacimiento"
        field="birthdate"
        min="1923-01-01"
        max={today}
        form={sForm}
        info="Si se desconoce la fecha, ingrese la estimada"
      />
      <TextInput label="Color" field="color" form={sForm}>
        <small class=" text-gray-400">
          Si no es de un color, una descripcion pequeña
        </small>
      </TextInput>
      <TextInput label="Observacion" field="observation" form={sForm} />
      <SelectInput
        label="Tamaño"
        unselectedLabel="Sin seleccionar"
        field="size"
        form={sForm}
        options={[
          { value: DogSize.SMALL, label: 'Pequeño' },
          { value: DogSize.MEDIUM, label: 'Mediano' },
          { value: DogSize.BIG, label: 'Grande' },
        ]}
      />
      <SelectInput
        label="Sexo"
        unselectedLabel="Sin seleccionar"
        field="sex"
        form={sForm}
        options={[
          { value: DogSex.FEMALE, label: 'Hembra' },
          { value: DogSex.MALE, label: 'Macho' },
        ]}
      />
      <SelectInput
        label="Raza"
        unselectedLabel="Sin seleccionar"
        field="breedId"
        form={sForm}
        options={breeds}
      />
      <ImageInput label="Imagen" field="image" form={sForm} />
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
</form>
