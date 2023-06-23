<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import { te } from '$lib/utils/translateEnums';
  import type { WorkingHour } from '@prisma/client';

  export let id: string;
  export let firstname: string;
  export let lastname: string;
  export let areas: string;
  export let workingHours: WorkingHour[];
  export let description: string;
  export let logged: boolean;
  // turn areas to string and map them with days
  function workingHourString(workingHour: WorkingHour) {
    let string = '';
    string += te.Day(workingHour.day) + ': ';
    string += workingHour.start.getHours() + ' - ' + workingHour.end.getHours();
    return string;
  }
</script>

<div
  class="flex min-h-full flex-col rounded border border-teal-500/50 bg-teal-100/25 p-4"
>
  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
    {firstname}
    {lastname}
  </h5>
  <p class="max-w-full break-words"><b>Areas:</b> {areas}</p>
  <p class="max-w-full break-words"><b>Descripción:</b> {description}</p>
  <p><b>Horarios:</b></p>
  {#each workingHours as hour}
    <p>{workingHourString(hour)}</p>
  {/each}
  <div class="mt-3 gap-2 flex flex-row max-h-min">
    <div>
      <form action="?/contact" method="post">
        <input type="text" class="hidden" value={id} name="providerId" />
        {#if logged}
          <Button type="submit" color="primary">Contactar</Button>
        {/if}
      </form>
    </div>
  </div>
</div>
