<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let username: string;
  export let date: string;
  export let daytime: string;
  export let newDate: string;
  export let newDaytime: string;
  export let message: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">Propuesta de cambio de turno</h1>
  </header>

  <main class="py-4">
    <p>
      Hola {username}!
    </p>
    <p>
      Queríamos informarte que no pudimos aceptar tu pedido de turno para el día <b
        >{date}</b
      >
      a la <b>{daytime}</b>.
    </p>
    <p>
      Se ha generado una propuesta de cambio para el día {newDate} a la {newDaytime},
      por favor, ingresa a tu cuenta para aceptarla o rechazarla.
    </p>
  </main>

  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
    <p>Mensaje del veterinario:</p>
    <p><i>"{message}"</i></p>
  </footer>
</EmailFrame>
