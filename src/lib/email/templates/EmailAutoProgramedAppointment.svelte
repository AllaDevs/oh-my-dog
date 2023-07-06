<script lang="ts">
  import type { AppointmentReason, Daytime } from '$lib/enums';
  import { te } from '$lib/utils/translateEnums';
  import EmailFrame from './EmailFrame.svelte';

  export let firstname: string;
  export let dogname: string;
  export let reason: AppointmentReason;
  export let date: string;
  export let daytime: Daytime;
</script>

<EmailFrame title="Veterinaria OhMyDog">
  <header class=" bg-teal-500 py-4 text-white">
    <h1 class="text-center font-bold">Turno auto programado</h1>
  </header>

  <main class="py-4">
    <p>
      Hola {firstname}!
    </p>
    <p>
      Queríamos informarte que se auto programó un turno de {te.AppointmentReason(
        reason
      )} para {dogname} el día {date} a la {te.Daytime(daytime)}.
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
