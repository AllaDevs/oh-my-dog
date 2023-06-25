<script>
  import { dev } from '$app/environment';
  import { page } from '$app/stores';

  $: pageNotFound = $page.status === 404;
</script>

<svelte:head>
  <title>
    {pageNotFound ? 'Pagina no encontrada' : 'Ocurrio un problema'}
  </title>
</svelte:head>

<main
  id="main"
  class="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8"
>
  <div class=" text-center">
    <p class=" text-base font-semibold text-teal-600">{$page.status}</p>
    <h1
      class=" mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl"
    >
      {pageNotFound ? 'Pagina no encontrada' : 'Ocurrio un problema'}
    </h1>
    <p class=" mt-6 text-base leading-7 text-gray-600">
      {$page.error?.message ?? 'Lo sentimos ocurrio un problema inesperado'}
    </p>
    <div class=" mt-10 flex flex-col items-center justify-center">
      <a
        href="/"
        class=" rounded-md bg-teal-600 underline-offset-2 hover:underline px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        Regresar al inicio
      </a>
    </div>
  </div>
  <div class=" text-center">
    <p class=" text-sm text-gray-600 max-w-sm">
      Si piensas que esto no deberia haber pasado, puedes comunicarte con
      <b>ohmydogvet.lp@gmail.com</b>
    </p>
  </div>
  {#if dev}
    <pre><code
        class="block whitespace-pre overflow-x-scroll scrollbar max-w-[75vw]"
        >{JSON.stringify($page.error, null, 2)}</code
      ></pre>
  {/if}
</main>
