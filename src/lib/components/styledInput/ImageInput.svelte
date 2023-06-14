<script lang="ts">
  interface $$Slots {
    belowInput: {};
    oppositeToLabel: {};
  }

  export let field: string;
  export let value: string;

  export let label: string;
  export let hint: string | undefined = undefined;
  export let readonly = false;
  export let required = false;
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
      type="file"
      id={field}
      name={field}
      autocomplete="off"
      {readonly}
      accept="image/jpeg, image/png, image/webp, image/jpg, image/avif"
      {required}
      {value}
      {...$$restProps}
      class=" mt-2 block w-full rounded-md border-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
    />
    {#if $$slots.belowInput}
      <slot name="belowInput" />
    {/if}
  </div>
</div>

<!--
@component
Remember to set enctype="multipart/form-data" on the form element containing this component.

Example:
```tsx
<form method="POST" enctype="multipart/form-data">
  <ImageInput
    label="Image"
    form={form}
    field="image"
  />
  <button type="submit">Upload</button>
</form>
```
-->

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
