<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';

  export let data;
</script>

<svelte:head>
  <title>Gestion de clientes</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg px-6 py-4"
  classHeaderSlot="flex w-full items-end justify-between py-2"
  classContentSlot="px-4 py-2"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Clientes</h2>
    <A href="/vet/client/register" color="primary" button>Nuevo cliente</A>
  </svelte:fragment>

  <div class="relative overflow-x-auto rounded scrollbar">
    <table class="w-full text-sm text-left text-white-500 border">
      <thead class=" text-sm text-gray-100 uppercase bg-teal-900">
        <tr>
          <th scope="col" class="px-6 py-3"> Nombre </th>
          <th scope="col" class="px-6 py-3"> Apellido </th>
          <th scope="col" class="px-6 py-3"> Email </th>
          <th scope="col" class="px-6 py-3"> Acciones </th>
        </tr>
      </thead>
      <tbody>
        {#each data.clients as client (client.id)}
          <tr class=" border-b border-gray-200">
            <th
              scope="row"
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
            >
              {client.username}
            </th>
            <td class="px-6 py-4">
              {client.lastname}
            </td>
            <td class="px-6 py-4">
              {client.email}
            </td>
            <td class="px-6 py-4">
              <div class=" min-w-max">
                <A href="/vet/client/{client.id}" color="primary" button>
                  Ver cuenta
                </A>
              </div>
            </td>
          </tr>
        {:else}
          <tr>
            <td class="px-6 py-4 text-gray-700" colspan="4">
              No hay clientes registrados
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</Page>
