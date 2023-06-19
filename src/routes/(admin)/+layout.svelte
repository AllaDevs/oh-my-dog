<script lang="ts">
  import Header from './Header.svelte';

  export let data;
</script>

<Header user={data.dev}/>

<main id="main">
  <div class=" container mx-auto mt-16 px-6">
    <slot />
  </div>
</main>

<footer>
  <!-- temporal placeholder -->
</footer>
