<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let firstname: string;
  export let date: string;
  export let daytime: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">Turno aceptado</h1>
  </header>

  <main class="py-4">
    <p>
      Hola {firstname}!
    </p>
    <p>
      Queríamos informarte tu pedido de turno para el día <b>{date}</b>
      a la <b>{daytime}</b> ha sido confirmado!
    </p>
    <p>
      Te esperamos! Por favor recordá avisarnos si no podés asistir a la
      consulta.
    </p>
  </main>

  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
