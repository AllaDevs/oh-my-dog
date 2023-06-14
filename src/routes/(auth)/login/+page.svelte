<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const sForm = superForm(data.form, {
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success('Inicio de sesion exitoso');
        // goto(result.location);
      }
    },
    onUpdated: ({ form }) => {
      if (form.errors._errors?.length) {
        const message = form.errors._errors[0].startsWith('AUTH')
          ? 'Ocurrio un error durante el proceso de autenticacion, intenta de nuevo'
          : 'Ocurrio un error en el servidor, intenta de nuevo';
        toast.error(message, { duration: 5000 });
      }
    },
  });

  $: authorizationMessage = $page.url.searchParams.get('message') ?? '';

  let noAccountHelp = false;
</script>

<svelte:head>
  <title>Iniciar sesión - ¡Oh my dog!</title>
</svelte:head>

<Page
  classContentSlot="flex flex-col justify-center max-w-sm mx-auto mb-[5%] px-6"
>
  {#if authorizationMessage}
    <p class="py-4 text-center text-sm font-semibold leading-5 text-red-500">
      {authorizationMessage}
    </p>
  {/if}

  <h1 class="mt-6 text-center text-2xl font-semibold text-gray-800">
    Iniciar sesión
  </h1>

  <form method="POST" use:sForm.enhance class=" py-4">
    <div class="mt-2 flex flex-col gap-2">
      <EmailInput label="Direccion de email" form={sForm} field="email" />
      <PasswordInput
        label="Contraseña"
        isNew={true}
        form={sForm}
        field="password"
      >
        <a
          href="/password_reset"
          slot="belowInput"
          class="text-sm font-medium text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline"
          >¿Olvidaste tu contraseña?</a
        >
      </PasswordInput>
    </div>

    <div class=" mt-8 flex items-center justify-around gap-4">
      <Button on:click={() => (noAccountHelp = !noAccountHelp)} color="default">
        ¿No tienes una cuenta?
      </Button>
      <Button type="submit" color="primary">Iniciar Sesión</Button>
    </div>

    <p
      class="mt-8 w-full px-6 text-center text-sm text-gray-600 opacity-0"
      style:opacity={noAccountHelp ? 1 : 0}
      style="transition: opacity 0.3s ease-in-out;"
    >
      Para crear una cuenta dirigete hacia una sucursal de la veterinaria con
      uno de tus perros, alli te registraran y te indicaran como iniciar sesion.
    </p>
  </form>
</Page>
