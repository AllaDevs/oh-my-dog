<script lang="ts">
  import type { FieldPath, UnwrapEffects } from 'sveltekit-superforms';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { AnyZodObject, z } from 'zod';

  import { formFieldProxy } from 'sveltekit-superforms/client';

  type T = $$Generic<AnyZodObject>;

  interface $$slots {
    belowInput: {};
    oppositeToLabel: {};
    options: {};
  }

  type Option = { value: string; text: string };

  export let form: SuperForm<UnwrapEffects<T>, unknown>;
  export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;

  export let label: string;
  export let hint: string | undefined = undefined;
  export let readonly: boolean = false;
  export let unselectedText: string = 'Sin seleccionar';
  /**
   * If an option is pre-selected, this must be the value of the option.
   */
  export let preSelected: string | undefined = undefined;
  export let options: Option[] | undefined = undefined;

  const { path, value, errors, constraints } = formFieldProxy(form, field);
</script>

<div class=" mt-2">
  <div class=" flex justify-between text-sm font-medium">
    <label for={String(field)} class=" max-w-fit text-gray-900">
      {label}
    </label>
    {#if $$slots.opossiteToLabel}
      <slot name="opossiteToLabel" />
    {:else if hint}
      <span class=" text-gray-500">{hint}</span>
    {/if}
  </div>
  <div class=" flex flex-col gap-2">
    <select
      id={String(field)}
      name={String(field)}
      autocomplete="off"
      disabled={readonly}
      bind:value={$value}
      data-invalid={$errors}
      {...$constraints}
      {...$$restProps}
      class=" mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 read-only:focus:ring-1 read-only:focus:ring-gray-300 sm:text-sm sm:leading-6"
    >
      {#if unselectedText}
        <option value="">{unselectedText}</option>
      {/if}
      {#if $$slots.options}
        <slot name="options" />
      {:else if options}
        {#each options as option}
          <option value={option.value} selected={option.value === preSelected}>
            {option.text}
          </option>
        {/each}
      {/if}
    </select>
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
  div:has(+ div select[required]) label::after {
    content: ' *';
    color: red;
  }
</style>
