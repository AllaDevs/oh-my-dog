<script>
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
</script>

<Page
  classContainer="container mx-auto px-6 py-4 text-gray-700 flex flex-col items-center"
  classContentSlot="py-2"
>
  <div
    class="flex flex-col items-center justify-between mb-7 mt-7 rounded bg-red-500 text-white max-w-fit p-4"
  >
    <h1 class="p-4 mt-4 text-2xl text-black"><b>URGENCIAS</b></h1>
    <p class="text-lg">
      Si tenés una urgencia, podés acudir a nuestras clínicas sin turno.
    </p>
    <p class="text-lg">Mirá las direcciones en el mapa de sucursales:</p>
    <div class="max-w-auto p-4 m-4">
      <A href="./subsidiary" color="default" button={true}>Mapa</A>
    </div>
  </div>
</Page>
