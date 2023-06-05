<script lang="ts">
  export let centered: boolean = false;
  export let maxWidth: string = '';
  export let className: string = '';
</script>

<main id="main" class=" pt-[--header-height]">
  <div class="mt-16 px-6 {centered && 'container mx-auto'} {maxWidth} {className}">
    <slot />
  </div>
</main>
