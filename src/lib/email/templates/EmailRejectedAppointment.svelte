<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let username: string;
  export let date: string;
  export let daytime: string;
  //'Turno rechazado',
  //`Hola ${client.username}. Queríamos informarte que no pudimos aceptar tu pedido de turno para el día ${appointment.date.toLocaleDateString()} a la ${dayTimeMapper(appointment.daytime)}, el mismo ha sido rechazado.
  // Por favor pedí un turno para una nueva fecha y nos pondremos en contacto!`
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">Turno Rechazado</h1>
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
    <p>Esperamos que pidas un nuevo turno, nos pondremos en contacto!</p>
  </main>

  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
