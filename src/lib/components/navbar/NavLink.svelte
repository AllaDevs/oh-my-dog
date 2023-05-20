<script lang="ts">
  export let current = false;
  export let href: string;
  export let noVisualEffects: boolean = false;
</script>

<a
  aria-current={current ? 'page' : false}
  href={current ? '#main' : href}
  class=" p-2 rounded {noVisualEffects
    ? ''
    : ' hover:bg-teal-200 hover:underline underline-offset-2'}"
>
  <slot />
</a>
