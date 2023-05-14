<script lang="ts">
  import { dev } from '$app/environment';
</script>

<h1 class="text-3xl font-bold p">Bienvenido a OhMyDog!</h1>

{#if dev}
  <div class=" flex justify-end p-4">
    <form method="post">
      <button
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        formaction="/dev?clearDB=true"
        type="submit">Clear DB</button
      >
    </form>
  </div>  
  <div class=" flex justify-end p-4">
    <form method="post">
      <button
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        formaction="/dev?addAdmin=true"
        type="submit">Add admin user</button
      >
    </form>
  </div>
{/if}
