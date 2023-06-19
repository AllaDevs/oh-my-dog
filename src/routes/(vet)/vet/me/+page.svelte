<script lang="ts">
  import AuthUpdateForm from '$cmp/auth/AuthUpdateForm.svelte';
  import FieldGroup from '$cmp/form/FieldGroup.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const accountSForm = superForm(data.accountForm, { id: 'accountForm' });

  const accountAuthSForm = superForm(data.accountAuthForm, {
    id: 'accountAuthForm',
    invalidateAll: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cuenta actualizada con exito', { duration: 3000 });
      } else {
        if (form.errors._errors) {
          toast.error(String(form.errors._errors), { duration: 5000 });
        }
      }
    },
  });
</script>

<svelte:head>
  <title>Cuenta administrativa</title>
</svelte:head>

<Page
  classContainer="container mx-auto px-6 py-4 scrollbar"
  classHeaderSlot="mt-2 md:mt-4"
  classContentSlot="p-4 grid gap-4 md:gap-8 lg:grid-cols-[1fr_2fr]"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Mi cuenta administrativa</h2>
  </svelte:fragment>

  <div>
    <FieldGroup>
      <svelte:fragment slot="title">
        <h3 class=" text-xl font-semibold text-gray-900">
          Informacion personal
        </h3>
      </svelte:fragment>
      <svelte:fragment slot="fields">
        <TextInput
          form={accountSForm}
          field="username"
          label="Nombre"
          readonly
        />
        <TextInput
          form={accountSForm}
          field="lastname"
          label="Apellido"
          readonly
        />
      </svelte:fragment>
    </FieldGroup>
  </div>

  <AuthUpdateForm action="?/authUpdate" sForm={accountAuthSForm} />
</Page>
