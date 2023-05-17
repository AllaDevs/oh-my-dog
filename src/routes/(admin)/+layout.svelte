<script lang="ts">
  export let data;
</script>

<header class="flex justify-between">
  <h1>Bienvenido {data.user.email}</h1>
  <div class=" flex p-4">
    <form method="POST">
      <button
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        formaction="/logout"
        type="submit">Cerrar Sesión</button
      >
    </form>
  </div>
</header>

<div class="grid place-items-center p-16">
  <slot />
</div>
