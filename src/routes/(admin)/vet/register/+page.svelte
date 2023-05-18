<script lang="ts">
  import { dateProxy, superForm } from 'sveltekit-superforms/client';
  import DateInput from '$lib/components/form/DateInput.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import Form from '$lib/components/form/Form.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import TelInput from '$lib/components/form/TelInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';

  export let data;

  const { form, errors, constraints, reset } = superForm(data.form);
  const birthdate = dateProxy(form, 'birthdate', { format: 'date' });
</script>

<SuperDebug data={$form} />

{#if $errors._errors}
  {$errors._errors}
{/if}

<Form method="POST">
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class=" text-lg font-semibold leading-7 text-gray-900">
      Nuevo cliente
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
      <DateInput
        label="Nacimiento"
        name="birthdate"
        min="1923-01-01"
        max="2007-12-31"
        constraints={$constraints.birthdate}
        bind:value={$birthdate}
        errors={$errors.birthdate}
      />
      <TelInput
        label="Numero de telefono"
        name="phone"
        constraints={$constraints.phone}
        bind:value={$form.phone}
        errors={$errors.phone}
      >
        <small slot="format" class=" text-gray-400">
          Formato: 123-456-7890
        </small>
      </TelInput>
    </div>
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <button
      type="button"
      on:click={() => reset()}
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
    >
      Cancelar
    </button>
    <SubmitButton action="?/client">Registrar cliente</SubmitButton>
  </div>
</Form>
