<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import type { ComponentProps } from 'svelte';

  type Color = ComponentProps<Button>['color'];

  interface $$Props {
    action: string;
    enhance?: (node: HTMLFormElement) => { destroy(): void };
    color?: Color;
    disabled?: boolean;
    class?: string;
  }

  export let action: string;
  export let enhance = (node: HTMLFormElement) => ({ destroy() {} });
  export let color: Color = 'default';
  export let disabled = false;
</script>

<form
  method="POST"
  {action}
  use:enhance
  class="p-2 md:p-4 {$$restProps.class ?? ''}"
>
  <Button type="submit" {color} {disabled}>
    <slot>Submit</slot>
  </Button>
</form>
