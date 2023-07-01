<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import type { Subsidiary } from '@prisma/client';
  import { createEventDispatcher } from 'svelte';

  export let subsidiary: Subsidiary;
  export let editable = false;

  const dispatch = createEventDispatcher<{ relocate: string }>();
</script>

<div
  class="flex flex-col h-full rounded shadow-md bg-teal-100/50 border border-gray-900"
>
  <div
    class="flex flex-col justify-between px-6 py-4 h-full"
  >
    <h3 class="font-semibold text-lg mb-2" style:text-wrap="balance">
      {subsidiary.name}
    </h3>
    <p class="text-gray-700 text-base break-all line-clamp-3">
      <b>Direccion:</b>
      {subsidiary.address}
    </p>
    <p class="text-gray-700 text-base break-all line-clamp-3">
      <b>Horarios:</b>
      {subsidiary.workHours}
    </p>
  </div>

  <div class="px-6 py-4 mb-2">
    {#if editable}
      <A href="./subsidiary/{subsidiary.id}" color="primary" button>Editar</A>
    {/if}
    <Button
      color="primary"
      on:click={() => dispatch('relocate', subsidiary.id)}
    >
      Ver en mapa
    </Button>
  </div>
</div>
