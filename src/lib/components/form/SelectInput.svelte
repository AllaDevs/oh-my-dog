<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms/index';

  export let label: string;
  export let unselectedLabel: string | undefined;
  export let name: string;
  export let constraints: InputConstraint | undefined = undefined;
  export let value: string;
  export let errors: string[] | undefined = undefined;
  export let options: { value: string; label: string }[];
</script>

<div class="sm:col-span-3">
  <label for={name} class="block text-sm font-medium leading-6 text-gray-900">
    {label}
  </label>
  <div class="mt-2">
    <select
      {name}
      id={name}
      autocomplete="off"
      {...constraints}
      bind:value
      data-invalid={errors}
      {...$$restProps}
      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
    >
      <option value="">{unselectedLabel}</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    {#if errors}
      <p class="mt-2 text-sm text-red-500">
        {errors}
      </p>
    {/if}
    <slot />
  </div>
</div>

<style>
  label:has(+ div > select[required])::after {
    content: ' *';
    color: red;
  }
</style>
