<script lang="ts">
  import type { HTMLFormAttributes } from 'svelte/elements';
  import type { SuperForm } from 'sveltekit-superforms/client';
  import type { ZodValidation } from 'sveltekit-superforms/index';
  import type { AnyZodObject } from 'zod';

  // type t<T extends ZodValidation<AnyZodObject>> = SuperForm<ZodValidation<AnyZodObject>>['enhance']
  interface $$Props extends HTMLFormAttributes {
    method: 'POST' | 'GET' | 'DIALOG';
    enctype?:
      | 'multipart/form-data'
      | 'application/x-www-form-urlencoded'
      | 'text/plain';
    action?: string;
    class?: string;
    enhance?: SuperForm<ZodValidation<AnyZodObject>>['enhance'];
  }
  export let method: 'POST' | 'GET' | 'DIALOG';
  export let enhance: SuperForm<ZodValidation<AnyZodObject>>['enhance'] = (
    el,
    events
  ) => ({ destroy() {} });
</script>

<form
  {method}
  {...$$restProps}
  class={`${$$restProps?.class ?? ''} space-y-6`}
  use:enhance
>
  <slot />
</form>
