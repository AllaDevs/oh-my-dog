<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import Map from '$cmp/subsidiary/Map.svelte';
  import SubsidiaryCard from '$cmp/subsidiary/SubsidiaryCard.svelte';

  export let data;
  let container: HTMLDivElement;
</script>

<svelte:head>
  <script
    async
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZvYlSiAUZzxF5WYBM1Rfc9828_MNYGzs&callback=initMap&libraries=places&v=weekly"
  >
  </script>
  <title>Sucursales</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <div class="flex flex-row justify-between mb-7 mt-7">
    <h2 class=" mt-4 text-2xl">Nuestras sucursales</h2>
    <A href="./subsidiary/new" color="primary" button={true}>Nueva Sucursal</A>
  </div>

  {#each data.subsidiaries as subsidiary}
    <SubsidiaryCard
      name={subsidiary.name}
      address={subsidiary.address}
      workingHour={subsidiary.workingHour}
    />
  {/each}
  <Map />
</Page>
