<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import IntegerInput from '$cmp/form/IntegerInput.svelte';
  import type { GeneralDonationSchema } from '$lib/schemas';
  import type { SuperForm } from 'sveltekit-superforms/client';

  export let action: string | undefined = undefined;
  export let sForm: SuperForm<GeneralDonationSchema, unknown>;
  export let title: string | undefined = undefined;
  export let classContainer: string = '';
</script>

<form method="POST" {action} use:sForm.enhance class={classContainer}>
  <FieldGroup cols="1">
    <svelte:fragment slot="title">
      <slot name="title">
        <h3 class=" text-xl font-medium text-gray-900">
          {title ?? 'Formulario de donacion'}
        </h3>
      </slot>
    </svelte:fragment>

    <svelte:fragment slot="fields">
      <div class="flex gap-4">
        <IntegerInput form={sForm} field="amount" label="Monto" />
        <div class=" mt-[2.25rem]">
          <Button type="submit" color="primary">Donar</Button>
        </div>
      </div>
    </svelte:fragment>
  </FieldGroup>
</form>
