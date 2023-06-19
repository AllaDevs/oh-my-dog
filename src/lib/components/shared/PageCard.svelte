<script lang="ts">
  export let href: string;
</script>

<a {href} class="grid h-full">
  <div
    class="flex min-h-full flex-col rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:scale-105 hover:border-teal-500 hover:bg-teal-100/50"
  >
    <header class=" text-lg">
      <slot name="header" />
    </header>
    <section class="hidden space-y-6 p-4">
      <slot name="content" />
    </section>
    {#if $$slots.footer}
      <hr class="opacity-50" />
      <footer class="card-footer">
        <slot name="footer" />
      </footer>
    {/if}
  </div>
</a>
