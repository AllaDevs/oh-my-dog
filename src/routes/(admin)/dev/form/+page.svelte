<script lang="ts">
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import PasswordInput from '$lib/components/form/PasswordInput.svelte';
  import SelectInput from '$lib/components/form/SelectInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const sForm = superForm(data.form);
  const { form, errors, constraints, enhance } = sForm;
</script>

<SuperDebug data={$form} />

<form method="POST" action="?/basic">
  <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 pb-4">
    <TextInput label="Texto libre" field="text" form={sForm} />
    <EmailInput label="Correo electronico" field="email" form={sForm} />
    <PasswordInput
      label="Contraseña"
      field="password"
      isNew={false}
      autocomplete={true}
      form={sForm}
    />
    <SelectInput
      label="Ciudad"
      unselectedLabel="Sin seleccionar"
      field="city"
      form={sForm}
      options={[
        { value: 'bsas', text: 'Buenos aires' },
        { value: 'med', text: 'Medellin' },
        { value: 'bar', text: 'Barcelona' },
      ]}
    />
  </div>

  <div class="mt-6 flex items-center justify-around gap-x-6">
    <SubmitButton />
  </div>
</form>
