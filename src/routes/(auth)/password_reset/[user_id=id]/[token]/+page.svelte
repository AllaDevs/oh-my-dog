<script lang="ts">
  import Page from '$cmp/layout/Page.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let errorOnSubmit = false;

  const sForm = superForm(data.form, {
    onSubmit: ({ cancel }: any) => {
      if ($form.password !== $form.passwordConfirm) {
        sForm.errors.update((errors) => {
          errors.passwordConfirm = ['Las contraseñas no coinciden'];
          return errors;
        });
        cancel();
        return;
      }
    },
    onResult: ({ result }) => {
      if (result.type === 'redirect') {
        toast.success(
          'Se ha restablecido tu contraseña, ya puedes iniciar sesion'
        );
        // goto(result.location);
      }
    },
    onUpdated: ({ form }) => {
      if (form.errors._errors?.length) {
        errorOnSubmit = true;
        toast.error(form.errors._errors[0], { duration: 5000 });
      }
    },
  });
  const { form, errors, enhance } = sForm;

  form.subscribe(() => (errorOnSubmit = false));

  $: noEnhanceError = !errorOnSubmit && $errors._errors?.length;
</script>

<svelte:head>
  <title>Restablecer contraseña - ¡Oh my dog!</title>
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
    Restablecer contraseña
  </h1>

  <form method="POST" use:enhance class=" mt-2 py-4">
    <div class="mt-2 flex flex-col gap-2">
      <PasswordInput
        label="Nueva contraseña"
        field="password"
        isNew={true}
        form={sForm}
      />
      <PasswordInput
        label="Confirmar nueva contraseña"
        field="passwordConfirm"
        isNew={true}
        form={sForm}
      />
    </div>

    <div class="mt-8 flex items-center justify-around">
      <SubmitButton>Cambiar contraseña</SubmitButton>
    </div>
  </form>
</Page>
