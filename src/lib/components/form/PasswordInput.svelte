<script lang="ts">
  import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { z, AnyZodObject } from 'zod';

  import { formFieldProxy } from 'sveltekit-superforms/client';

  type T = $$Generic<AnyZodObject>;

  interface $$slots {
    belowInput: {};
    oppositeToLabel: {};
  }

  export let form: SuperForm<UnwrapEffects<T>, unknown>;
  export let field: (keyof z.infer<T> | FieldPath<z.infer<T>>) & string;

  export let label: string;
  export let hint: string | undefined = undefined;
  export let readonly: boolean = false;
  export let isNew: boolean = false;
  export let autocomplete: boolean = false;

  const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<div class=" mt-2">
  <div class=" flex justify-between text-sm font-medium">
    <label for={field} class=" max-w-fit text-gray-900">
      {label}
    </label>
    {#if $$slots.opossiteToLabel}
      <slot name="opossiteToLabel" />
    {:else if hint}
      <span class=" text-gray-500">{hint}</span>
    {/if}
  </div>
  <div class=" flex flex-col gap-2">
    <input
      type="password"
      id={field}
      name={field}
      autocomplete={isNew ? 'off' : autocomplete ? 'current-password' : 'off'}
      {readonly}
      bind:value={$value}
      data-invalid={$errors}
      {...$constraints}
      {...$$restProps}
      class=" mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
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

<style>
  div:has(+ div input[required]) label::after {
    content: ' *';
    color: red;
  }
</style>
