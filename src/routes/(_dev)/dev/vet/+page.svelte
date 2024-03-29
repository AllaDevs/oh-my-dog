<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import EmailInput from '$cmp/form/EmailInput.svelte';
  import PasswordInput from '$cmp/form/PasswordInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { friendlyDateARG } from '$lib/utils/functions.js';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const registerSForm = superForm(data.registerForm, { taintedMessage: false });
  const { form, errors, enhance } = registerSForm;

  const deleteSForm = superForm(data.deleteForm, { taintedMessage: false });
  const { errors: deleteErrors } = deleteSForm;
</script>

<svelte:head>
  <title>Admin - Vets</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-xl p-4 scrollbar"
  classContentSlot="mt-2 px-4 text-gray-900 flex flex-col md:mb-8"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-semibold">
      Vet accounts
    </h2>
  </svelte:fragment>

  {#if $errors._errors}
    <div class="bg-red-500 text-white p-4 rounded shadow">
      <h3 class="text-lg font-semibold">Register form errors</h3>
      <ul class="list-disc list-inside">
        {#each $errors._errors as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <section class="grid md:grid-cols-2 gap-4 lg:grid-cols-3">
    <div class="pb-8 md:pb-0 md:pr-8">
      <form
        method="POST"
        action="?/register"
        use:enhance
        class="flex flex-col gap-2"
      >
        <h3 class=" mt-[1em] text-lg md:text-xl text-gray-900 font-semibold">
          New vet
        </h3>
        <TextInput
          label="Firstname"
          field="firstname"
          form={registerSForm}
          autocomplete="given-name"
        />
        <TextInput
          label="Lastname"
          field="lastname"
          form={registerSForm}
          autocomplete="family-name"
        />
        <EmailInput
          label="Email"
          field="email"
          form={registerSForm}
          autocomplete={false}
        />
        <PasswordInput
          label="Password"
          field="password"
          form={registerSForm}
          isNew
        />
        <div class="flex justify-center my-2">
          <Button type="submit" color="primary">Register</Button>
        </div>
        <SuperDebug data={$form} />
      </form>
    </div>

    <div class="flex flex-col gap-4 overflow-y-hidden scrollbar lg:col-span-2">
      <h3 class=" mt-[1em] text-lg md:text-xl text-gray-900 font-semibold">
        Vets
      </h3>

      {#if $deleteErrors._errors}
        <div class="bg-red-500 text-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold">Delete form errors</h3>
          <ul class="list-disc list-inside">
            {#each $deleteErrors._errors as error}
              <li>{error}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <ul
        class="grid gap-4 mb-auto overflow-y-auto scrollbar py-4 md:py-0 px-4 lg:grid-cols-2"
      >
        {#each data.vets as vet}
          <li class=" border border-gray-900/75 px-4 py-3 rounded shadow">
            <p>Firstname: {vet.firstname}</p>
            <p>Lastname: {vet.lastname}</p>
            <p>Email: {vet.email}</p>
            <p>Created at: {friendlyDateARG(vet.createdAt)}</p>
            <form
              method="POST"
              action="?/delete"
              use:deleteSForm.enhance
              class="ml-auto mt-2 w-max"
            >
              <input type="text" name="id" value={vet.id} class="hidden" />
              <Button type="submit" color="error">Delete</Button>
            </form>
          </li>
        {:else}
          <li>
            <p class=" font-medium text-gray-700" style:text-wrap="balance">
              No vets registered
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</Page>
