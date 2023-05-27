<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import SubForm from './SubForm.svelte';

  import { DogSex, DogSize } from '$lib/enums';
  import type { UnwrapEffects } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';

  type T = $$Generic<AnyZodObject>;

  export let sForm: SuperForm<UnwrapEffects<T>, unknown>;
  
  export let title = 'Nuevo perro';
  export let breeds: { value: string; text: string }[];
</script>

<SubForm>
  <svelte:fragment slot="title">{title}</svelte:fragment>
  <svelte:fragment slot="fields">
    <TextInput label="Nombre" field="dogName" form={sForm} />
    <DateInput
      label="Nacimiento"
      field="dogBirthdate"
      min="1923-01-01"
      max="2007-12-31"
      form={sForm}
      info="Si se desconoce la fecha, ingrese la estimada"
    />
    <TextInput label="Color" field="dogColor" form={sForm}>
      <small class=" text-gray-400">
        Si no es de un color, una descripcion pequeña
      </small>
    </TextInput>
    <TextInput label="Observacion" field="dogObservation" form={sForm} />
    <SelectInput
      label="Tamaño"
      unselectedLabel="Sin seleccionar"
      field="dogSize"
      form={sForm}
      options={[
        { value: DogSize.SMALL, text: 'Pequeño' },
        { value: DogSize.MEDIUM, text: 'Mediano' },
        { value: DogSize.BIG, text: 'Grande' },
      ]}
    />
    <SelectInput
      label="Sexo"
      unselectedLabel="Sin seleccionar"
      field="dogSex"
      form={sForm}
      options={[
        { value: DogSex.FEMALE, text: 'Hembra' },
        { value: DogSex.MALE, text: 'Macho' },
      ]}
    />
    <SelectInput
      label="Raza"
      unselectedLabel="Sin seleccionar"
      field="dogBreedId"
      form={sForm}
      options={breeds}
    />
    <ImageInput label="Imagen" field="dogImage" form={sForm} />
  </svelte:fragment>
</SubForm>
