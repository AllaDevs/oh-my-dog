<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  const sForm = superForm(data.form);
  const { form, message, enhance } = sForm;
</script>

<svelte:head>
  <title>Recuperar cuenta - ¡Oh my dog!</title>
</svelte:head>

<h1 class="mt-6 text-center text-2xl font-semibold text-gray-800">
  Recuperar cuenta
</h1>
<p class="mt-2 text-center text-sm text-gray-500">
  Ingresa la direccion de email de tu cuenta y te enviaremos un enlace para
  restablecer tu contraseña.
</p>

<form method="POST" use:enhance>
  <div class="mt-6">
    <EmailInput
      label="Direccion de email"
      field="email"
      autocomplete={true}
      form={sForm}
    />
  </div>

  <div class="mt-6 flex justify-around">
    <SubmitButton>Enviar email de restablecimiento</SubmitButton>
  </div>
</form>

<p
  class="mt-10 w-full px-6 text-center text-sm text-gray-600 opacity-0"
  style:opacity={$message ? 1 : 0}
  style="transition: opacity 0.3s ease-in-out;"
>
  El email de restablecimiento ha sido enviado a <b>{$form.email}</b>,
  revisa la bandeja de entrada.
</p>
