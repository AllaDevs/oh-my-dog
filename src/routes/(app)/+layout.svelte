<script lang="ts">
  import Header from './Header.svelte';

  export let data;
</script>

<Header user={data.user} />

<slot />

<footer>
  <!-- temporal placeholder -->
</footer>
