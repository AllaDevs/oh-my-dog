<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import DateInput from '$cmp/form/DateInput.svelte';
  import DniInput from '$cmp/form/DniInput.svelte';
  import EmailInput from '$cmp/form/EmailInput.svelte';
  import PasswordInput from '$cmp/form/PasswordInput.svelte';
  import TelInput from '$cmp/form/TelInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { friendlyDateARG } from '$lib/utils/functions.js';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const sForm = superForm(data.form, { taintedMessage: false });
  const { form, errors, enhance } = sForm;
</script>

<svelte:head>
  <title>Admin - Clients</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-xl p-4 scrollbar"
  classContentSlot="mt-2 px-4 text-gray-900 flex flex-col md:mb-8"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-semibold">
      Client accounts
    </h2>
  </svelte:fragment>

  {#if $errors._errors}
    {$errors._errors}
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
          New client
        </h3>

        <TextInput
          label="Firstname"
          form={sForm}
          field="firstname"
          autocomplete="given-name"
        />
        <TextInput
          label="Lastname"
          form={sForm}
          field="lastname"
          autocomplete="family-name"
        />
        <EmailInput
          label="Email"
          form={sForm}
          field="email"
          autocomplete={false}
        />
        <DateInput
          label="Birthdate"
          min="1923-01-01"
          max="2007-12-31"
          form={sForm}
          field="birthdate"
        />
        <TelInput
          label="Phone"
          form={sForm}
          field="phone"
          hint="Formar: 123-456-7890"
        />
        <DniInput form={sForm} field="dni" />
        <PasswordInput label="Password" field="password" form={sForm} isNew />

        <div class="flex justify-center my-2">
          <Button type="submit" color="primary">Register</Button>
        </div>

        <SuperDebug data={$form} />
      </form>
    </div>

    <div class="flex flex-col gap-4 overflow-y-hidden scrollbar lg:col-span-2">
      <h3 class=" mt-[1em] text-lg md:text-xl text-gray-900 font-semibold">
        Clients
      </h3>

      <ul
        class="grid gap-4 mb-auto overflow-y-auto scrollbar py-4 md:py-0 px-4 lg:grid-cols-2"
      >
        {#each data.clients as client}
          <li class=" border border-gray-900/75 px-4 py-3 rounded shadow">
            <p>Firstname: {client.firstname}</p>
            <p>Lastname: {client.lastname}</p>
            <p>Email: {client.email}</p>
            <p>Created at: {friendlyDateARG(client.createdAt)}</p>
          </li>
        {:else}
          <li>
            <p class=" font-medium text-gray-700" style:text-wrap="balance">
              No clients registered
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</Page>
