<script lang="ts">
  interface $$Slots {
    legend: {};
    fields: {};
    actions: {};
  }

  export let disabled: boolean = false;
</script>

<fieldset {disabled} class=" border p-4 rounded border-gray-900/10">
  <legend class=" -ml-2 text-lg font-semibold leading-7 text-gray-900">
    <slot name="legend" />
  </legend>

  <div class=" grid gap-2 md:grid-cols-2">
    <slot name="fields" />
  </div>

  <div class=" mt-6 flex items-center justify-around">
    <slot name="actions" />
  </div>
</fieldset>

<style>
  fieldset[disabled]:global(:is(input, select, textarea)) {
    opacity: 0.85;
    cursor: not-allowed;
  }
</style>
