<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import Map from '$cmp/subsidiary/Map.svelte';
  import SubsidiaryCard from '$cmp/subsidiary/SubsidiaryCard.svelte';

  export let data;
  let container: HTMLDivElement;
</script>

<svelte:head>
  <script
    async
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDZvYlSiAUZzxF5WYBM1Rfc9828_MNYGzs&callback=initMap"
  >
  </script>
  <title>Sucursales</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700"
  classContentSlot="py-2"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Nuestras sucursales</h2>
  </svelte:fragment>
  {#each data.subsidiaries as subsidiary}
    <SubsidiaryCard
      name={subsidiary.address.street}
      adress={subsidiary.address}
      workingHour={subsidiary.workingHour}
    />
  {/each}
  <Map />
</Page>
