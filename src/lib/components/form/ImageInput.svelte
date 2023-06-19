<script lang="ts">
  import type { FormPathLeaves, ZodValidation } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import { formFieldProxy } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';

  interface $$Slots {
    belowInput: {};
    oppositeToLabel: {};
  }

  type T = $$Generic<AnyZodObject>;

  export let form: SuperForm<ZodValidation<T>, unknown>;
  export let field: FormPathLeaves<z.infer<T>>;

  export let label: string;
  export let hint: string | undefined = undefined;
  export let readonly = false;
  export let disabled = false;

  const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<div class=" mt-2">
  <div class=" flex justify-between text-sm font-medium">
    <label for={field} class=" max-w-fit text-gray-900">
      {label}
    </label>
    {#if $$slots.oppositeToLabel}
      <slot name="oppositeToLabel" />
    {:else if hint}
      <span class=" text-gray-500">{hint}</span>
    {/if}
  </div>
  <div class=" flex flex-col gap-2">
    <input
      type="file"
      id={field}
      name={field}
      autocomplete="off"
      disabled={readonly || disabled}
      accept="image/jpeg, image/png, image/webp, image/jpg, image/avif"
      bind:value={$value}
      aria-invalid={!!$errors || undefined}
      {...$constraints}
      {...$$restProps}
      class=" mt-2 block w-full rounded-md border-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
    />
    {#if $errors}
      <p class="text-sm text-red-500">
        {$errors}
      </p>
    {/if}
    {#if $$slots.belowInput}
      <slot name="belowInput" />
    {/if}
  </div>
</div>

<!--
@component
Remember to set enctype="multipart/form-data" on the form element containing this component.

Example:
```tsx
<form method="POST" enctype="multipart/form-data">
  <ImageInput
    label="Image"
    form={form}
    field="image"
  />
  <button type="submit">Upload</button>
</form>
```
-->

<style lang="postcss">
  div:has(div input[required]) label::after {
    content: ' *';
    color: red;
  }

  input {
    @apply cursor-pointer outline-none text-gray-900 bg-white;
  }
  input::file-selector-button {
    @apply bg-teal-300/75 outline-none text-gray-900 border-none ring-1 border-gray-300 ring-inset hover:bg-teal-200 mr-2 focus:ring-2 focus:ring-inset focus:ring-teal-600;
    @apply cursor-pointer font-medium py-1.5 px-4 rounded-l-md;
  }

  input:focus {
    @apply ring-2 ring-teal-600;
  }
  input:focus::file-selector-button {
    @apply ring-2;
  }

  input:disabled {
    @apply cursor-not-allowed bg-gray-100 ring-gray-200;
  }
  input:disabled::file-selector-button {
    @apply cursor-not-allowed bg-gray-100 ring-gray-200 hover:bg-gray-100;
  }
</style>
