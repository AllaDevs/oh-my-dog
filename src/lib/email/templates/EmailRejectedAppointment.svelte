<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let firstname: string;
  export let date: string;
  export let daytime: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">Turno Rechazado</h1>
  </header>

  <main class="py-4">
    <p>
      Hola {firstname}!
    </p>
    <p>
      Queríamos informarte que no pudimos aceptar tu pedido de turno para el día <b
        >{date}</b
      >
      a la <b>{daytime}</b>.
    </p>
    <p>Esperamos que pidas un nuevo turno, nos pondremos en contacto!</p>
  </main>

  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
