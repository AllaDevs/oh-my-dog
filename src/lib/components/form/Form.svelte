<script lang="ts">
  import type { HTMLFormAttributes } from 'svelte/elements';

  interface $$Props extends HTMLFormAttributes {
    method: 'POST' | 'GET' | 'DIALOG';
    enctype?:
      | 'multipart/form-data'
      | 'application/x-www-form-urlencoded'
      | 'text/plain';
    action?: string;
    class?: string;
  }

  export let method: 'POST' | 'GET' | 'DIALOG';
</script>

<form {method} {...$$restProps} class={`${$$restProps?.class ?? ''} space-y-6`}>
  <slot />
</form>
