<script lang="ts">
  import EmailFrame from './EmailFrame.svelte';

  export let firstname: string;
  export let lastname: string;
  export let email: string;
  export let dogname: string;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">
      Confirmacion del contacto por la adopcion de <b>{dogname}.</b>
    </h1>
  </header>
  <main>
    <p>
      Se te informa que se contacto con exito a <b>{firstname} {lastname}</b>
      por el post de adopcion de <b>{dogname}</b>.
    </p>
    <p>
      El publicante estara en contacto contigo mediante el email <b>{email}</b>.
    </p>
  </main>
  <footer class="bg-gray-200 py-4 text-white">
    <p class="text-center">
      Atentamente,<br />
      El equipo de OhMyDog
    </p>
  </footer>
</EmailFrame>
