<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import type { Client } from '@prisma/client';

  type T = $$Generic<
    Client & {
      _count: {
        donation: number;
      };
    }
  >;

  export let donors: T[];
</script>

<div class="relative overflow-x-auto scrollbar rounded border">
  <table
    class="w-full text-sm text-left text-white-500 border-b md:border-none"
  >
    <thead class=" text-sm text-gray-100 uppercase bg-teal-900 w-max">
      <tr>
        <th scope="col" class="px-6 py-3 whitespace-nowrap"
          >Donante (nombre y apellido)</th
        >
        <th scope="col" class="px-6 py-3">Saldo positivo</th>
        <th scope="col" class="px-6 py-3">Donaciones efectuadas</th>
        <th scope="col" class="px-6 py-3">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each donors as donor (donor.id)}
        <tr class=" border-b border-gray-200">
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {donor.username}
            {donor.lastname}
          </td>
          <td class="px-6 py-4">
            {donor.discountAmount}
          </td>
          <td class="px-6 py-4">
            {donor._count.donation}
          </td>
          <td class="px-6 py-4">
            <div class=" min-w-max">
              <A href="/vet/client/{donor.id}" color="primary" button>
                Ver cuenta
              </A>
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td class="px-6 py-4 text-gray-700" colspan="4">
            No hay donadores registrados
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
