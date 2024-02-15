<script lang="ts" context="module">
  const ANONYMOUS_DONOR = {
    firstname: "Anonimo",
    lastname: "",
  } as const;
</script>

<script lang="ts">
  import A from "$cmp/element/A.svelte";
  import { friendlyDate } from "$lib/utils/functions";
  import type { Client, Donation } from "@prisma/client";

  type T = $$Generic<
    Donation & {
      client: Pick<Client, "id" | "firstname" | "lastname"> | null;
    }
  >;

  export let donations: T[];
</script>

<div class="relative overflow-x-auto scrollbar rounded border">
  <table
    class="w-full text-sm text-left text-white-500 border-teal-500/50 md:border-none"
  >
    <thead class=" text-sm text-gray-100 uppercase bg-teal-900 w-max">
      <tr>
        <th scope="col" class="px-6 py-3 whitespace-nowrap"
          >Donante (nombre y apellido | anonimo)</th
        >
        <th scope="col" class="px-6 py-3">Fecha</th>
        <th scope="col" class="px-6 py-3">Monto</th>
        <th scope="col" class="px-6 py-3">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each donations as donation (donation.id)}
        {@const donor = donation.client ?? ANONYMOUS_DONOR}
        <tr class=" border-teal-500/50">
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {donor.firstname}
            {donor.lastname}
          </td>
          <td class="px-6 py-4">
            {friendlyDate(donation.createdAt)}
          </td>
          <td class="px-6 py-4">
            {donation.amount}
          </td>
          <td class="px-6 py-4">
            {#if donation.client}
              <div class=" min-w-max">
                <A
                  href="/vet/client/{donation.client.id}"
                  color="primary"
                  button
                >
                  Ver cuenta
                </A>
              </div>
            {/if}
          </td>
        </tr>
      {:else}
        <tr>
          <td class="px-6 py-4 text-gray-700" colspan="4">
            No hay donaciones registradas
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
