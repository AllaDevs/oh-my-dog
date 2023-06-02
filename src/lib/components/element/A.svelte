<script lang="ts">
  export let href: string;
  export let color: 'teal' | 'gray' | 'red';
  export let intensity: 600 | 500 | 400;
  export let opacity: 80 | 90 | 100 = 100;
</script>

<a
  {href}
  class=" opacity-{opacity} hover:underline underline-offset-2 rounded-md bg-{color}-{intensity} px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-{color}-{intensity -
    100} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-{intensity}}"
>
  <slot />
</a>
