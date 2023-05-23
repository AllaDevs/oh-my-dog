<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms';

  export let label: string;
  export let name: string;
  export let autocomplete: string = 'off';
  export let constraints: InputConstraint | undefined = undefined;
  export let value: string | undefined;
  export let errors: string[] | undefined = undefined;
</script>

<div class="sm:col-span-3">
  <label
    for={name}
    class=" block max-w-fit p-2 text-sm font-medium text-gray-900"
  >
    {label}
  </label>
  <input
    type="text"
    {name}
    id={name}
    {autocomplete}
    {...constraints}
    bind:value
    required
    data-invalid={errors}
    {...$$restProps}
    class="ml-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
  />
  {#if errors}
    <p class="mt-2 text-sm text-red-500">
      {errors}
    </p>
  {/if}
  <slot />
</div>

<style>
  label:has(+ input[required])::after {
    content: ' *';
    color: red;
  }
</style>
