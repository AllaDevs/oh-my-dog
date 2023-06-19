<script lang="ts">
  export let cols : "1" | "2" | "3" = "1";

  let gridCols = 'grid-cols-1';
  $: switch (cols) {
    case "1": {
      gridCols = 'grid-cols-1';
      break;
    }
    case "2": {
      gridCols = 'grid-cols-1 md:grid-cols-2 md:gap-x-8'
      break;
    }
    case "3": {
      gridCols = 'grid-cols-1 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 lg:gap-x-6'
      break;
    }
  }
</script>

<div
  class=" flex flex-col border border-solid p-6 rounded border-gray-900/10 sm:mx-8 md:mx-0"
>
  <div class=" flex justify-between">
    <slot name="title" />
  </div>

  <div class=" grid mt-2 gap-2 md:gap-y-4 {gridCols}">
    <slot name="fields" />
  </div>

  <div class=" mt-6 flex items-center justify-around">
    <slot name="actions" />
  </div>
</div>
