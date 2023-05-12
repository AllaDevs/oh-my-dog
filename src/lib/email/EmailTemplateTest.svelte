<script lang="ts">
  export let username: string;
  export let lastname: string;
  export let password: string;
</script>

<html lang="es">
<head>
  <title>¡Has sido registrado en OhMyDog!</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <header class="bg-blue-500 text-white py-4">
    <h1 class="text-center font-bold">¡Has sido registrado en OhMyDog!</h1>
  </header>
  <main class="py-4">
    <p>Bienvenido {username} {lastname} a la mejor clínica veterinaria de la ciudad.</p>
    <p>Tu contraseña es: <b>{password}</b></p>
    <p>Puedes cambiar tu contraseña en cualquier momento en tu perfil.</p>
    <p>¡Esperamos verte pronto!</p>
  </main>
  <footer class="bg-gray-200 text-white py-4">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</body>
</html>
