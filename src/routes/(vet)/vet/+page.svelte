<script lang="ts">
  import PageCard from '$lib/components/vet/PageCard.svelte';

  export let data;

  const navLinks = [
    { href: '/vet/client', text: 'Clientes' },
    { href: '/vet/appointment', text: 'Turnos' },
    { href: '/vet/donation', text: 'Donaciones' },
    { href: '/vet/publicity', text: 'Paseadores y cuidadores' },
    { href: '/vet/subsidiary', text: 'Sucursales' },
    { href: '/vet/me', text: 'Cuenta administrativa' },
  ];
</script>

<svelte:head>
  <title>¡Oh my dog!</title>
</svelte:head>

<main id="main" class="mx-auto px-6 py-4">
  <header>
    <h2 class=" mt-4 text-2xl">Bienvenido {data.vet.username}</h2>
    <h6 class=" mt-1 text-sm text-gray-500">
      Que tengas un buen dia de trabajo!
    </h6>
  </header>
  <article class="px-4 py-2">
    <ul
      class="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3"
    >
      {#each navLinks as link}
        <li class="h-full">
          <PageCard href={link.href}>
            <h3 slot="header" class="h3">{link.text}</h3>
            <p slot="content" />
          </PageCard>
        </li>
      {/each}
    </ul>
  </article>
</main>
