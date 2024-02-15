<script lang="ts">
  import CampaignsCarousel from "$cmp/donation/CampaignsCarousel.svelte";
  import Page from "$cmp/layout/Page.svelte";

  export let data;
</script>

<svelte:head>
  <title>Veterinaria ¡Oh my dog!</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg p-4 scrollbar-hidden"
  classContentSlot="mt-2 px-4 text-gray-900 mb-8"
>
  {#if data.campaigns.length}
    <div class="mb-8">
      <CampaignsCarousel campaigns={data.campaigns} />
    </div>
  {/if}

  <header class="text-center py-12">
    <h1 class="mt-4 text-4xl font-bold text-black" style:text-wrap="balance">
      Bienvenido a <b>Oh my dog!</b>
    </h1>
    <p class="mt-2 text-sm">
      ¡Que tengas un buen dia{data.client?.firstname
        ? " " + data.client.firstname
        : ""}!
    </p>
  </header>

  <section class="mt-6">
    <div class="border-b border-gray-300 pb-4">
      <h2 class="text-2xl font-bold mt-[1em]">¿Quienes somos?</h2>
      <p>
        Somos una veterinaria que se preocupa por el bienestar de tu mascota,
        contamos con los mejores profesionales y equipos para atender a tu
        mascota.
      </p>
    </div>

    <div class="border-b border-gray-300 pb-4 to-right">
      <h2 class="text-2xl font-bold">¿Que hacemos?</h2>
      <p>
        Ofrecemos servicios de consulta, vacunacion, desparasitacion,
        facilitacion para contactar otros dueños de mascotas, y mucho mas.
      </p>
    </div>

    <div class="border-b border-gray-300 pb-4">
      <h2 class="text-2xl font-bold">¿Donde estamos?</h2>
      <p>
        Nosotros nos encontramos en la ciudad de La Plata, para nuestras
        sucursales visita la pagina de sucursales.
      </p>
    </div>

    <div class=" pb-4 to-right">
      <h2 class="text-2xl font-bold">¿Como contactarnos?</h2>
      <p>
        Si es tu primera vez en la veterinaria, te pedimos que te acerques a la
        sucursal mas cercana para que te podamos registrar en nuestro sistema.
        <br />
        Si ya estas registrado, iniciá sesión en la pagina para poder acceder a los
        servicios que ofrecemos.
      </p>
    </div>
  </section>
</Page>

<style lang="postcss">
  h1,
  h2,
  p {
    margin-top: 1em;
    text-wrap: balance;
  }

  section {
    @apply text-gray-900;
  }
  section > div {
    @apply mt-8;
  }

  section p {
    @apply lg:max-w-[75%];
  }

  p {
    @apply ml-2;
  }
  .to-right {
    @apply text-right mr-2;
  }
  .to-right p {
    @apply ml-auto;
  }
</style>
