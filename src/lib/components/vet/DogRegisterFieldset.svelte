<script lang="ts">
  import DateInput from '$lib/components/form/DateInput.svelte';
  import Fieldset from '$lib/components/form/Fieldset.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  import { DogSex, DogSize } from '$lib/enums';
  import type { ClientCompleteRegisterSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';

  export let sForm: SuperForm<ClientCompleteRegisterSchema, unknown>;
  export let index: number;
  export let legend: string;
  export let breeds: { value: string; text: string }[];
</script>

<Fieldset>
  <svelte:fragment slot="legend">
    {legend || `Nuevo perro ${index + 1}`}
  </svelte:fragment>
  <svelte:fragment slot="fields">
    <TextInput label="Nombre" field={['dogs', index, 'name']} form={sForm} />
    <DateInput
      label="Nacimiento"
      field={['dogs', index, 'birthdate']}
      min="1923-01-01"
      max="2007-12-31"
      form={sForm}
      hint="Si se desconoce la fecha, ingrese la estimada"
    />
    <TextInput
      label="Color"
      field={['dogs', index, 'color']}
      form={sForm}
      hint="Un color o una descripcion pequeña"
    />
    <TextInput
      label="Observacion"
      field={['dogs', index, 'observation']}
      form={sForm}
    />
    <SelectInput
      label="Tamaño"
      unselectedLabel="Sin seleccionar"
      field={['dogs', index, 'size']}
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
      field={['dogs', index, 'sex']}
      form={sForm}
      options={[
        { value: DogSex.FEMALE, text: 'Hembra' },
        { value: DogSex.MALE, text: 'Macho' },
      ]}
    />
    <SelectInput
      label="Raza"
      unselectedLabel="Sin seleccionar"
      field={['dogs', index, 'breedId']}
      form={sForm}
      options={breeds}
    />
    <ImageInput label="Imagen" field={['dogs', index, 'image']} form={sForm} />
  </svelte:fragment>
</Fieldset>
