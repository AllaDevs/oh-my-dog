<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let errorOnSubmit = false;

  const sForm = superForm(data.form, {
    onUpdated: ({ form }) => {
      if (form.errors._errors?.length) {
        errorOnSubmit = true;
        toast.error(form.errors._errors[0], { duration: 5000 });
      }
    },
  });
  const { form, errors, message, enhance } = sForm;

  form.subscribe(() => (errorOnSubmit = false));

  $: noEnhanceError = !errorOnSubmit && $errors._errors?.length;
</script>

<svelte:head>
  <title>Recuperar cuenta - ¡Oh my dog!</title>
</svelte:head>

<Page
  classContentSlot="flex flex-col justify-center max-w-sm mx-auto mb-[5%] px-6"
>
  {#if noEnhanceError}
    <p class="py-4 text-center text-sm font-semibold leading-5 text-red-500">
      {String($errors._errors)}
    </p>
  {/if}

  <h1 class="mt-6 text-center text-2xl font-semibold text-gray-800">
    Recuperar cuenta
  </h1>

  <p class="mt-2 text-center text-sm text-gray-500">
    Ingresa la direccion de email de tu cuenta y te enviaremos un enlace para
    restablecer tu contraseña.
  </p>

  <form method="POST" use:enhance class=" py-4">
    <div class="mt-2">
      <EmailInput
        label="Direccion de email"
        field="email"
        autocomplete={true}
        form={sForm}
      />
    </div>

    <div class="mt-8 flex items-center justify-around">
      <Button type="submit" color="primary">
        Enviar email de restablecimiento
      </Button>
    </div>
  </form>

  <p
    class="mt-8 w-full px-6 text-center text-sm text-gray-600 opacity-0"
    style:opacity={$message ? 1 : 0}
    style="transition: opacity 0.3s ease-in-out;"
  >
    El email de restablecimiento ha sido enviado a <b>{$form.email}</b>, revisa
    la bandeja de entrada.
  </p>
</Page>
