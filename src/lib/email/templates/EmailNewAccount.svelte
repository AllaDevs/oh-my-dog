<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let firstname: string;
  export let lastname: string;
  export let password: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">¡Has sido registrado en OhMyDog!</h1>
  </header>

  <main class="py-4">
    <p>
      Bienvenido {firstname}
      {lastname} a la mejor clínica veterinaria para perros de la ciudad.
    </p>
    <p>Tu contraseña es: <b>{password}</b></p>
    <p>Puedes cambiar tu contraseña en cualquier momento en tu perfil.</p>
    <p>¡Esperamos verte pronto!</p>
  </main>

  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
