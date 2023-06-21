<script lang="ts">
  export let id: string;
  export let username: string;
  export let lastname: string;
  export let areas: string;
  // export let workingHour: WorkingHour[];
  // turn areas to string and map them with days
</script>

<a href="provider/{id}" class="grid h-full">
  <div
    class="flex min-h-full max-w-full flex-col rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:scale-105 hover:border-teal-500 hover:bg-teal-100/50"
  >
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
      {username}
      {lastname}
    </h5>
    <p class="text-black line-clamp-1"><b>Areas:</b> {areas}</p>
    <!-- {#each weekdayHours as day}
    <p><b>{day.name}:</b> {each day.hours as hour}{hour}{/each}</p>
  {/each} -->
  </div>
</a>
