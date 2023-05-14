<script lang="ts">
  export let label: string;
  let forInput: string;
  export { forInput as for };
</script>

<div class="sm:col-span-3">
  <label
    for={forInput}
    class="block text-sm font-medium leading-6 text-gray-900"
  >
    {label}
  </label>
  <div class="mt-2">
    <slot />
  </div>
</div>

<style>
  div > :global(label:has(+ div > :is(input, select)[required]))::after {
    content: ' *';
    color: red;
  }
</style>
