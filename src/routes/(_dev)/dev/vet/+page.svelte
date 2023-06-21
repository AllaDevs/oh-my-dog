<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import EmailInput from '$cmp/form/EmailInput.svelte';
  import PasswordInput from '$cmp/form/PasswordInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors } = sForm;
</script>

<div class="grid md:grid-cols-2 place-items-center">
  <form method="POST" class="flex flex-col mx-auto gap-4 md:flex-row">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base font-semibold leading-7 text-gray-900">
        Cargar nuevo veterinario
      </h2>

      <div class="mt-4 grid grid-cols-1 gap-y-4">
        <TextInput
          label="Nombre"
          field="firstname"
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

    <div class="mt-6 grid items-center justify-between gap-4">
      <div class=" self-start">
        <Button type="submit" color="primary">Registrar veterinario</Button>
      </div>
      <div class="flex flex-col">
        <SuperDebug data={$form} />
        {#if $errors._errors}
          {$errors._errors}
        {/if}
      </div>
    </div>
  </form>

  <div class="mt-6 flex flex-col items-center gap-x-6">
    <h3 class="text-xl font-semibold text-gray-900">Veterinarios</h3>
    <ul>
      {#each data.vets as vet}
        <li class=" border border-gray-900/10 p-4">
          <p>{vet.firstname}</p>
          <p>{vet.lastname}</p>
          <p>{vet.email}</p>
        </li>
      {/each}
    </ul>
  </div>
</div>
