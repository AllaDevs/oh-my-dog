<script context="module">
  import { DogSize } from '$lib/enums';
  import { te } from '$lib/utils/translateEnums';

  const sizeOptions = [
    { value: DogSize.SMALL, text: te.DogSize(DogSize.SMALL) },
    { value: DogSize.MEDIUM, text: te.DogSize(DogSize.MEDIUM) },
    { value: DogSize.BIG, text: te.DogSize(DogSize.BIG) },
  ];
</script>

<script lang="ts">
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<ZodValidation<T>, unknown>;
  export let field: FormPathLeaves<z.infer<T>>;
  export let label = 'Tamaño';
  export let readonly = false;
</script>

<SelectInput {label} {form} {field} options={sizeOptions} {readonly} />
