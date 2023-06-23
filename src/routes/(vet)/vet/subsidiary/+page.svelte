<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import SubsidiaryCard from '$cmp/subsidiary/SubsidiaryCard.svelte';
  import { onMount } from 'svelte';

  export let data;
  let container: HTMLDivElement;
  let map: google.maps.Map;
  let zoom = 12;
  let center = { lat: -34.92945, lng: -57.93453 };

  function relocateCenter(id: string) {
    // search fot id on data.subsidiaries
    let newCenter: google.maps.LatLng | undefined;
    for (let i = 0; i < data.subsidiaries.length; i++) {
      if (data.subsidiaries[i].id === id) {
        newCenter = new google.maps.LatLng({
          lat: data.subsidiaries[i].location.latitude,
          lng: data.subsidiaries[i].location.longitude,
        });
        break;
      }
    }
    if (!newCenter) return console.error('No se encontro la sucursal');
    map.setCenter(newCenter);
    map.setZoom(15);
  }

  onMount(() => {
    map = new google.maps.Map(container, {
      zoom,
      center,
    });
    for (let i = 0; i < data.subsidiaries.length; i++) {
      const latlng = new google.maps.LatLng({
        lat: data.subsidiaries[i].location.latitude,
        lng: data.subsidiaries[i].location.longitude,
      });
      const marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: data.subsidiaries[i].name,
      });
    }
  });
</script>

<svelte:head>
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
      vet={true}
      id={subsidiary.id}
      name={subsidiary.name}
      address={subsidiary.address}
      workingHour={subsidiary.workingHour}
      on:relocate={(e) => relocateCenter(e.detail)}
    />
  {/each}
  <div class="h-[70vh] w-[90vw] mt-7" bind:this={container} />
</Page>
