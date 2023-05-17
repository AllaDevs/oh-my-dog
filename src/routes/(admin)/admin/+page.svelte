<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import Form from '$lib/components/form/Form.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  export let data;

  const { form, errors, constraints } = superForm(data.form);
</script>

<Form method="POST">
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class="text-base font-semibold leading-7 text-gray-900">
      Cargar nuevo veterinario
    </h2>

    <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <TextInput
        label="Nombre"
        name="username"
        autocomplete="given-name"
        constraints={$constraints.username}
        bind:value={$form.username}
        errors={$errors.username}
      />
      <TextInput
        label="Apellido"
        name="lastname"
        autocomplete="family-name"
        constraints={$constraints.lastname}
        bind:value={$form.lastname}
        errors={$errors.lastname}
      />
      <EmailInput
        label="Direccion de email"
        name="email"
        autocomplete={false}
        constraints={$constraints.email}
        bind:value={$form.email}
        errors={$errors.email}
      />
      <PasswordInput
        label="Contraseña"
        name="password"
        isNew={true}
        constraints={$constraints.password}
        bind:value={$form.password}
        errors={$errors.password}
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
</Form>
