<script lang="ts">
  import Header from './Header.svelte';

  export let data;
</script>

<Header user={data.user} />

<main id="main">
  <div class="mx-auto mt-16 max-w-sm px-6">
    <slot />
  </div>
</main>
