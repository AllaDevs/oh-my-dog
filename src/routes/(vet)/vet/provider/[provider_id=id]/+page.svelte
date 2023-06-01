<script>
  import EmailInput from '$lib/components/form/EmailInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const sForm = superForm(data.form);
  const { form, constraints, errors } = sForm;
</script>

<form method="POST">
  <div class="border-b border-gray-900/10 pb-12">
    <h2 class=" text-lg font-semibold leading-7 text-gray-900">
      Datos del {data.provider.type}
    </h2>

    <div class="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
      <!-- email: z.string().email(),
    areas: z.string(),
    username: z.string(),
    lastname: z.string(),
    description: z.string() -->
      <EmailInput label="Mail" field="email" autocomplete={true} form={sForm} />
      <TextInput
        label="Areas"
        field="areas"
        autocomplete={data.provider.areas}
        form={sForm}
      />
      <TextInput
        label="Nombre"
        field="areas"
        autocomplete={data.provider.areas}
        form={sForm}
      />
      <TextInput
        label="Appelido"
        field="areas"
        autocomplete={data.provider.areas}
        form={sForm}
      />
      <TextInput
        label="Descripción"
        field="areas"
        autocomplete={data.provider.areas}
        form={sForm}
      />
    </div>
  </div>
</form>
<div>
  <form action="?/delete" method="post">
    <input
      type="text"
      name="providerId"
      value={data.provider.id}
      class="hidden"
    />
    <button
      type="submit"
      class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
    >
      eliminar
    </button>
  </form>
  <SubmitButton action="?/update">Actualizar</SubmitButton>
</div>
