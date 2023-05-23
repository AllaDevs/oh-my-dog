<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Gestion de clientes</title>
</svelte:head>

<main
  id="main"
  class="container mx-auto flex max-w-screen-lg flex-col px-6 py-4"
>
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-2xl">Clientes</h2>
    <a href="/vet/client/register" class="btn variant-filled btn-sm">
      Nuevo cliente
    </a>
  </header>

  <article class="table-container table-interactive px-4 py-2">
    <table class="table-hover table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each data.clients as client (client.id)}
          <tr>
            <td>{client.username}</td>
            <td>{client.lastname}</td>
            <td class="break-all">{client.email}</td>
            <td>
              <div class=" flex gap-2">
                <a
                  href="/vet/client/{client.id}?editable=false"
                  class="btn variant-filled btn-sm">Detallar</a
                >
                <a
                  href="/vet/client/{client.id}?editable=true"
                  class="btn variant-filled btn-sm">Editar</a
                >
                <form action="/vet/client?/delete" method="post">
                  <input type="text" value={client.id} class="hidden" />
                  <button type="submit" class="btn variant-filled btn-sm">
                    Eliminar
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </article>
</main>
