<script lang="ts">
  export let href: string;
  export let img: { src: string; alt: string };
  export let title: string;
  export let description: string = '';
</script>

<a {href} class="max-w-sm rounded overflow-hidden shadow-lg">
  <!-- svelte-ignore a11y-missing-attribute -->
  <img class="w-full" {...img} />
  <div class="px-6 py-4">
    <h3 class="font-bold text-xl mb-2">{title}</h3>
    <p class="text-gray-700 text-base">{description}</p>
  </div>
</a>
