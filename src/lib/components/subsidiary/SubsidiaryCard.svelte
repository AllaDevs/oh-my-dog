<script lang="ts">
  import { te } from '$lib/utils/translateEnums';
  import type { Address, WorkingHour } from '@prisma/client';

  // export let workingHour: WorkingHour[];
  export let name: string;
  export let address: Address;
  export let workingHours: WorkingHour[];
  // turn areas to string and map them with days
  function workingHourString(workingHour: WorkingHour) {
    let string = '';
    string += te.Day(workingHour.day) + ': ';
    string += workingHour.start.getHours() + ' - ' + workingHour.end.getHours();
    return string;
  }

  function addressString(address: Address) {
    let newAddress = '';
    newAddress += address.city + ' - ' + address.street + ', ' + address.number;
    return newAddress;
  }
</script>

<div
  class="flex min-h-full flex-col rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:scale-105 hover:border-teal-500 hover:bg-teal-100/50"
>
  <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
    Sucursal - {name}
  </h5>
  <!-- <p><b>Telefono:</b> {subsidiary.phone}</p> -->
  <p><b>Dirección:</b> {addressString(address)}</p>
  <p><b>Horario:</b></p>
  {#each workingHours as hour}
    <p>{workingHourString(hour)}</p>
  {/each}
</div>
