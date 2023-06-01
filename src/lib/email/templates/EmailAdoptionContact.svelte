<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let username: string;
  export let lastname: string;
  export let email: string;
  export let phone: string;
  export let dogname: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">
      Contacto por la adopcion de <b>{dogname}</b>
    </h1>
  </header>
  <main>
    <p>
      El cliente <b>{username} {lastname}</b> ha solicitado contactarse contigo
      por la adopcion de <b>{dogname}</b>.
    </p>
    <p>
      Puedes contactarte con el cliente a traves de su correo electronico <b
        >{email}</b
      >
      o a traves de su numero de telefono <b>{phone}</b>.
    </p>
    <p>Si ya fue adoptado o eliminas el post, ignora este mensaje.</p>
  </main>
  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">Atentamente,</p>
    <p class="text-center">El equipo de OhMyDog</p>
  </footer>
</EmailFrame>
