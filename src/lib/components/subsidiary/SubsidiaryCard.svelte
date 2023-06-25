<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import { te } from '$lib/utils/translateEnums';
  import type { WorkingHour } from '@prisma/client';
  import { createEventDispatcher } from 'svelte';

  // export let workingHour: WorkingHour[];
  export let name: string;
  export let address: string;
  export let workingHour: WorkingHour[];
  export let id: string;
  export let vet: boolean;

  function workingHourString(workingHour: WorkingHour) {
    return `${te.Day(workingHour.day)}: ${workingHour.start
      .getHours()
      .toString()
      .padStart(2, '0')}:${workingHour.start
      .getMinutes()
      .toString()
      .padStart(2, '0')} - ${workingHour.end
      .getHours()
      .toString()
      .padStart(2, '0')}:${workingHour.end
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  const dispatch = createEventDispatcher<{ relocate: string }>();
</script>

<div
  class="flex min-h-fit flex-col rounded border border-teal-500/50 bg-teal-100/25 p-4"
>
  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
    Sucursal - {name}
  </h5>
  <!-- <p><b>Telefono:</b> {subsidiary.phone}</p> -->
  <p><b>Dirección:</b> {address}</p>
  <p><b>Horarios:</b></p>
  {#each workingHour as hour}
    <p>{workingHourString(hour)}</p>
  {/each}
  <div class="mt-3 gap-2 flex flex-row max-h-min">
    {#if vet}
      <A href="./subsidiary/{id}" color="primary" button>Editar</A>
    {/if}
    <Button color="primary" on:click={() => dispatch('relocate', id)}>
      Ver en mapa
    </Button>
  </div>
</div>
