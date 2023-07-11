<script lang="ts">
  import { enhance } from '$app/forms';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import toast from 'svelte-french-toast';
  import ServiceHealthCard from './ServiceHealthCard.svelte';

  export let data;

  let services = data.services.all;

  const enhanceAll = (el: HTMLFormElement) =>
    enhance(el, () => {
      return async ({ result }) => {
        switch (result.type) {
          case 'success': {
            // @ts-expect-error
            services = result.data?.services?.all;
            toast.success('Services updated', { duration: 3000 });
            break;
          }
          case 'failure': {
            toast.error('Failed to update services', { duration: 3000 });
            break;
          }
          case 'error': {
            toast.error(String(result.error), { duration: 5000 });
            break;
          }
        }
      };
    });
</script>

<svelte:head>
  <title>Admin - Services</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-xl p-4"
  classContentSlot="mt-2 px-4 text-gray-900 flex flex-col md:mb-8"
>
  <svelte:fragment slot="pageHeader">
    <h2
      class=" mt-[1em] text-2xl md:text-3xl text-gray-900 font-semibold"
      style:text-wrap="balance"
    >
      Application services health check
    </h2>
  </svelte:fragment>

  <section
    class="flex flex-col gap-4 overflow-y-hidden scrollbar pb-8 md:pb-0 md:mt-4"
  >
    <header class="flex justify-between">
      <h3 class=" mt-[1em] text-lg md:text-xl text-gray-900 font-semibold">
        Services
      </h3>
      <ActionButton
        action="?/checkAll"
        color="primary"
        class="!p-0 self-end"
        enhance={enhanceAll}
      >
        Refresh all
      </ActionButton>
    </header>

    <ul
      class="grid gap-8 mb-auto overflow-y-hidden scrollbar py-4 md:py-0 px-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <li>
        <ServiceHealthCard
          name="Database"
          service={services.database}
          refreshAction="?/checkDatabase"
        />
      </li>
      <li>
        <ServiceHealthCard
          name="Email"
          service={services.email}
          refreshAction="?/checkEmail"
        />
      </li>
      <li>
        <ServiceHealthCard
          name="Image"
          service={services.image}
          refreshAction="?/checkImage"
        />
      </li>
    </ul>
  </section>
</Page>
