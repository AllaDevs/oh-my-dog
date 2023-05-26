<script lang="ts">
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import DateInput from '$lib/components/form/DateInput.svelte';
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import TelInput from '$lib/components/form/TelInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { superForm, dateProxy } from 'sveltekit-superforms/client';

  export let data;

  let readonly = !data.editable;
  const sForm = superForm(data.form);
  const { form, constraints, errors, enhance, reset } = sForm;
  const birthdate = dateProxy(form, 'birthdate', { format: 'date' });
</script>

<form method="POST">
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class=" text-lg font-semibold leading-7 text-gray-900">
      Nuevo cliente
    </h2>
  
    <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
      <TextInput
        label="Nombre"
        field="username"
        autocomplete="given-name"
        {readonly}
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
      <DateInput
        label="Nacimiento"
        field="birthdate"
        min="1923-01-01"
        max="2007-12-31"
        form={sForm}
      />
      <TelInput
        label="Numero de telefono"
        field="phone"
        form={sForm}
        info="Formato: 123-456-7890"
      />
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
    <button
      type="button"
      on:click={() => (readonly = !readonly)}
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
    >
      editar
    </button>
    <SubmitButton action="?/client">Registrar cliente</SubmitButton>
  </div>
</form>
