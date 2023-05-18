<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms/index';

  export let label: string;
  export let name: string;
  export let constraints: InputConstraint | undefined = undefined;
  export let value: string;
  export let errors: string[] | undefined = undefined;
</script>

<div class="sm:col-span-3">
  <label for={name} class="block text-sm font-medium leading-6 text-gray-900">
    {label}
  </label>
  <div class="mt-2">
    <input
      type="tel"
      {name}
      id={name}
      autocomplete="off"
      {...constraints}
      bind:value
      data-invalid={errors}
      {...$$restProps}
      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
    />
    <slot name="format" />
    {#if errors}
      <p class="mt-2 text-sm text-red-500">
        {errors}
      </p>
    {/if}
    <slot />
  </div>
</div>

<style>
  label:has(+ div > input[required])::after {
    content: ' *';
    color: red;
  }
</style>
