<script lang="ts">
  import Button from '$cmp/element/Button.svelte';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  const sForm = superForm(data.form, { taintedMessage: false });
</script>

<svelte:head>
  <title>Admin - Breed</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-xl p-4"
  classContentSlot="mt-2 px-4 text-gray-900 flex flex-col md:mb-8 overflow-y-hidden"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-semibold">
      Breeds
    </h2>
  </svelte:fragment>

  <section class="grid md:grid-cols-2 gap-4 overflow-y-hidden">
    <div class="pb-8 md:pb-0 md:pr-8">
      <form
        method="POST"
        action="?/registerBreed"
        use:sForm.enhance
        class="flex flex-col gap-4"
      >
        <h3 class=" mt-[1em] text-lg md:text-xl text-gray-900 font-semibold">
          New breed
        </h3>
        <div class="flex items-end gap-x-6 w-full">
          <TextInput label="Breed name" field="name" form={sForm} />
          <Button type="submit" color="primary">Register</Button>
        </div>
        <SuperDebug data={sForm.form} />
      </form>
    </div>

    <div class="flex flex-col gap-4 overflow-y-hidden scrollbar">
      <h3 class=" mt-[1em] text-lg md:text-xl text-gray-900 font-semibold">
        Breeds
      </h3>
      <ul
        class="flex flex-col md:grid gap-4 mb-auto overflow-y-auto scrollbar py-4 md:py-0 px-4 lg:grid-cols-2"
      >
        {#each data.breeds as breed}
          <li class=" border-b border-y-cyan-900 border-opacity-25 p-1">
            <p class="  text-ellipsis overflow-hidden whitespace-nowrap">
              {breed.name}
            </p>
          </li>
        {:else}
          <li>
            <p class=" font-medium text-gray-700" style:text-wrap="balance">
              No breeds registered
            </p>
            <ActionButton
              action="?/registerDefaultBreeds"
              color="primary"
              class="!p-0 !pt-2"
            >
              Register base breeds
            </ActionButton>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</Page>
