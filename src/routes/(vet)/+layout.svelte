<script lang="ts">
  import Header from './Header.svelte';

  export let data;
</script>

<Header user={data.vet} />

<slot />

<footer>
  <!-- temporal placeholder -->
</footer>
