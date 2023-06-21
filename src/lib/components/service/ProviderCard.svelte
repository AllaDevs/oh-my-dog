<script lang="ts">
  import { te } from '$lib/utils/translateEnums';
  import type { WorkingHour } from '@prisma/client';

  export let id: string;
  export let username: string;
  export let lastname: string;
  export let areas: string;
  export let workingHours: WorkingHour[];
  // turn areas to string and map them with days
  function workingHourString(workingHour: WorkingHour) {
    let string = '';
    string += te.Day(workingHour.day) + ': ';
    string += workingHour.start.getHours() + ' - ' + workingHour.end.getHours();
    return string;
  }
</script>

<a href="provider/{id}" class="grid h-full">
  <div
    class="flex min-h-full flex-col rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:scale-105 hover:border-teal-500 hover:bg-teal-100/50"
  >
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
      {username}
      {lastname}
    </h5>
    <p class="max-w-full break-words"><b>Areas:</b> {areas}</p>
    <p><b>Horarios:</b></p>
    {#each workingHours as hour}
      <p>{workingHourString(hour)}</p>
    {/each}
  </div>
</a>
