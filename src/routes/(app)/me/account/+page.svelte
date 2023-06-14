<script lang="ts">
  import AuthUpdateForm from '$cmp/auth/AuthUpdateForm.svelte';
  import A from '$cmp/element/A.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  const accountAuthSForm = superForm(data.accountAuthForm, {
    invalidateAll: false,
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Cuenta actualizada con exito');
      } else {
        if (form.errors._errors) {
          toast.error(String(form.errors._errors), {
            duration: 5000,
          });
        }
      }
    },
  });
</script>

<svelte:head>
  <title>Cuenta personal</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg mt-4 px-4"
  classHeaderSlot="mt-2 md:mt-4 flex justify-between items-end"
  classContentSlot="p-4"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Mi autenticacion</h2>
    <A href="/me" button>Regresar a Mi cuenta</A>
  </svelte:fragment>

  <AuthUpdateForm action="?/authUpdate" sForm={accountAuthSForm} />
</Page>
