<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let href: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 text-white py-4">
    <h1 class="text-center font-bold">Recuperación de contraseña</h1>
  </header>
  <main>
    <p>
      Has solicitado recuperar tu contraseña. Haz click en el siguiente enlace
      para cambiar tu contraseña.
    </p>
    <p>
      <a {href}>{href}</a>
    </p>
    <p>Si no has solicitado recuperar tu contraseña, ignora este mensaje.</p>
  </main>
  <footer class="bg-gray-200 text-white py-4">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
