<script lang="ts">
  interface $$slots {
    title: {};
    fields: {};
  }
</script>

<div class="border p-4 rounded border-gray-900/10">
  <h2 class=" text-lg font-semibold leading-7 text-gray-900">
    <slot name="title" />
  </h2>

  <div class="mt-4 grid gap-2 md:grid-cols-2">
    <slot name="fields" />
  </div>
</div>
