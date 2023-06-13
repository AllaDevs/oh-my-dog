<script lang="ts">
  interface $$Slots {
    legend: {};
    fields: {};
    actions: {};
  }

  export let disabled: boolean = false;
</script>

<fieldset
  {disabled}
  class=" flex flex-col border border-solid p-4 rounded border-gray-900/10"
>
  <legend class=" text-lg font-semibold text-gray-900">
    <slot name="legend" />
  </legend>

  <div class=" grid gap-2 md:grid-cols-2">
    <slot name="fields" />
  </div>

  <slot name="actions" />
</fieldset>

<style>
  fieldset[disabled]:global(:is(input, select, textarea)) {
    opacity: 0.85;
    cursor: not-allowed;
  }
</style>
