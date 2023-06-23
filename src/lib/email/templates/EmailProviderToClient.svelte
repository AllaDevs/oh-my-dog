<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let username: string;
  export let providerName: string;
  export let providerLastName: string;
  export let email: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">Datos de contacto</h1>
  </header>

  <main class="py-4">
    <p>
      Hola {username}!
    </p>
    <p>
      Te enviamos los datos de contacto del proveedor que solicitaste, <b
        >{providerName} {providerLastName}</b
      >.
    </p>
    <p>
      Podrás contactarlo por medio del mail <b>{email}</b>, estamos seguros de
      que será muy bueno con tus perros!
    </p>
  </main>

  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
