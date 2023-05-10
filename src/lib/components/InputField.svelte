<script lang="ts">
  export let label: string;
  export let name: string;
</script>

<div class="sm:col-span-3">
  <label for={name} class="block text-sm font-medium leading-6 text-gray-900">
    {label}
  </label>
  <div class="mt-2">
    <slot />
  </div>
</div>
