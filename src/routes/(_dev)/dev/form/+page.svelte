<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import EmailInput from '$cmp/form/EmailInput.svelte';
  import PasswordInput from '$cmp/form/PasswordInput.svelte';
  import SelectInput from '$cmp/form/SelectInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
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
    <Button type="submit" color="primary">Submit</Button>
  </div>
</form>
