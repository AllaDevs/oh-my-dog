<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  interface $$Props extends HTMLButtonAttributes{

  }
	// export let type = 'submit' as const;
	export let action: string | undefined = undefined;
  export let className: string | undefined = undefined;
</script>

<button
  type="submit"
  formaction={action}
  class="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 {className} "
  {...$$restProps}
  on:click
>
  <slot>Enviar</slot>
</button>
