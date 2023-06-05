<script context="module">
  import { DogSex } from '$lib/enums';
  import { te } from '$lib/utils/translateEnums';

  const sexOptions = [
    { value: DogSex.FEMALE, text: te.DogSex(DogSex.FEMALE) },
    { value: DogSex.MALE, text: te.DogSex(DogSex.MALE) },
  ];
</script>

<script lang="ts">
  import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';

  import SelectInput from '$lib/components/form/SelectInput.svelte';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<UnwrapEffects<T>, unknown>;
  export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;
  export let label = 'Sexo';
  export let readonly = false;
</script>

<SelectInput {label} {form} {field} options={sexOptions} {readonly} />
