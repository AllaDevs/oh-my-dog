<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let firstname: string;
  export let lastname: string;
  export let providerName: string;
  export let email: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">Datos de contacto</h1>
  </header>

  <main class="py-4">
    <p>
      Hola {providerName}!
    </p>
    <p>
      Te informamos que el cliente <b>{firstname} {lastname}</b> solicitó tus datos
      de contacto.
    </p>
    <p>
      Podrás contactarlo por medio del mail <b>{email}</b>, esperamos que
      lleguen a un muy buen acuerdo!
    </p>
  </main>

  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
