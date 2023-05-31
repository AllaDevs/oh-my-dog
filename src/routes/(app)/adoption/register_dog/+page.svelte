<script lang="ts">
  import Button from '$lib/components/element/Button.svelte';
  import DateInput from '$lib/components/form/DateInput.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { DogSex, DogSize } from '$lib/enums.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';
  export let data;

  let breeds: { value: string; text: string }[] = [];
  for (const breed of data.breeds) {
    breeds.push({ value: breed.id, text: breed.name });
  }

  const sForm = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Perro para adoción registrado con exito');
      }
    },
  });
</script>

<main id="main">
  <div>
    <Button
      ><a href="/adoption/dogs_for_adoption">Dar en adopcion mi perro</a
      ></Button
    >
  </div>
  <div class="mx-auto mt-16 max-w-xl px-6">
    <h1 class="mt-4 text-3xl font-bold text-center">
      Registrar perro a dar en adopción
    </h1>
    <form
      method="POST"
      class="mt-8 py-4"
      enctype="multipart/form-data"
      use:sForm.enhance
    >
      <TextInput label="Nombre" form={sForm} field="name" />
      <DateInput label="Nacimiento estimado" form={sForm} field="birthdate" />
      <SelectInput
        label="Tamaño"
        form={sForm}
        field="size"
        options={[
          { value: DogSize.SMALL, text: 'Pequeño' },
          { value: DogSize.MEDIUM, text: 'Mediano' },
          { value: DogSize.BIG, text: 'Grande' },
        ]}
      />
      <SelectInput
        label="Sexo"
        form={sForm}
        field="sex"
        options={[
          { value: DogSex.FEMALE, text: 'Hembra' },
          { value: DogSex.MALE, text: 'Macho' },
        ]}
      />
      <TextInput label="Color" form={sForm} field="color" />
      <ImageInput label="Imagen" form={sForm} field="image" />
      <TextInput label="Observación" form={sForm} field="observation" />
      <SelectInput label="Raza" form={sForm} field="breedId" options={breeds} />
      <div>
        <SubmitButton>Registrar perro</SubmitButton>
      </div>
    </form>
  </div>
</main>
