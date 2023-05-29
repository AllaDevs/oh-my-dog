<script lang="ts">
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors } = sForm;
</script>

<form method="POST">
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class="text-base font-semibold leading-7 text-gray-900">
      Cargar nuevo veterinario
    </h2>

    <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <TextInput
        label="Nombre"
        field="username"
        autocomplete="given-name"
        form={sForm}
      />
      <TextInput
        label="Apellido"
        field="lastname"
        autocomplete="family-name"
        form={sForm}
      />
      <EmailInput
        label="Direccion de email"
        field="email"
        autocomplete={false}
        form={sForm}
      />
      <PasswordInput
        label="Contraseña"
        field="password"
        isNew={true}
        form={sForm}
      />
    </div>
  </div>

  <div class="mt-6 flex items-center justify-between gap-x-6">
    <div class="flex flex-col">
      <SuperDebug data={$form} />
      {#if $errors._errors}
        {$errors._errors}
      {/if}
    </div>
    <div class=" self-start">
      <SubmitButton>Registrar veterinario</SubmitButton>
    </div>
  </div>
</form>
