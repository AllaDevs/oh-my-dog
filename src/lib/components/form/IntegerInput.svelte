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
  export let readonly: boolean = false;
  export let min: `${number}` | undefined = undefined;
  export let max: `${number}` | undefined = undefined;

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
      type="number"
      id={field}
      name={field}
      {readonly}
      step="1"
      {min}
      {max}
      bind:value={$value}
      aria-invalid={!!$errors || undefined}
      {...$constraints}
      {...$$restProps}
      class=" mt-2 block w-full rounded-md border-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
    />
    {#if $errors}
      <p class=" text-sm text-red-500">
        {$errors}
      </p>
    {/if}
    {#if $$slots.belowInput}
      <slot name="belowInput" />
    {/if}
  </div>
</div>

<style lang="postcss">
  div:has(div input[required]:not(:read-only)) label::after {
    content: ' *';
    color: red;
  }

  input:focus {
    @apply ring-2 ring-teal-600;
  }
  input:read-only {
    @apply cursor-not-allowed bg-gray-100 ring-gray-200;
  }
</style>
