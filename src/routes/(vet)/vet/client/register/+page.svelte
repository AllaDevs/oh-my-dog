<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
  import TelInput from '$lib/components/form/TelInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import DateInput from '$lib/components/form/DateInput.svelte';

  export let data;

  const form = superForm(data.form);
  const { form: formStore, errors, reset } = form;
</script>

<SuperDebug data={$formStore} />

{#if $errors._errors}
  {$errors._errors}
{/if}

<form method="POST">
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class=" text-lg font-semibold leading-7 text-gray-900">
      Nuevo cliente
    </h2>

    <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <TextInput
        label="Nombre"
        name="username"
        autocomplete="given-name"
        {form}
        field="username"
      />
      <TextInput
        label="Apellido"
        name="lastname"
        autocomplete="family-name"
        {form}
        field="lastname"
      />
      <EmailInput
        label="Direccion de email"
        autocomplete={false}
        {form}
        field="email"
      />
      <DateInput
        label="Nacimiento"
        min="1923-01-01"
        max="2007-12-31"
        {form}
        field="birthdate"
      />
      <TelInput
        label="Numero de telefono"
        {form}
        field="phone"
        info="Formato: 123-456-7890"
      />
      <TextInput label="DNI" autocomplete="off" {form} field="dni" />
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
</form>
