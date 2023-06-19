<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { onMount } from 'svelte';
  import { superForm } from 'sveltekit-superforms/client';
  import { notifyDonationStatus } from '../../donationShared.js';

  export let data;

  const donationSForm = superForm(data.donationForm, {
    taintedMessage: false,
  });

  onMount(() => {
    notifyDonationStatus(data.donationStatus);
  });
</script>

<svelte:head>
  <title>Campaña de donacion</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg px-6 py-4"
  classHeaderSlot="flex flex-col w-full justify-between py-2 md:flex-row"
  classContentSlot="flex flex-col gap-4 px-4"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Campaña de donacion</h2>
    <div class="w-max md:self-end my-2">
      <A href="/donation" color="default" button>Volver a las campañas</A>
    </div>
  </svelte:fragment>

  <section class="mt-4">
    <div
      class="lg:p-4 rounded shadow-lg bg-teal-100/50 border border-gray-900 lg:grid lg:grid-cols-2"
    >
      <div class="my-auto h-full border-b border-gray-900">
        <img
          class="h-60 lg:h-full object-cover rounded-t mx-auto"
          src={data.campaign.banner?.url}
          alt="banner de la campaña de donacion {data.campaign.name}"
        />
      </div>

      <div class="px-4 my-2 lg:px-2 lg:ml-4">
        <div class="py-4">
          <h3 class="font-semibold text-lg mb-2">
            {data.campaign.name}
          </h3>
          <p class="px-2 text-gray-700 text-base break-all">
            {data.campaign.description}
          </p>
        </div>

        <div class="py-4 mb-2">
          <form method="POST" action="?/donate" use:donationSForm.enhance>
            <h4 class="text-lg font-semibold">Donar a la campaña</h4>
            <div class="px-2 flex justify-between gap-4">
              <TextInput form={donationSForm} field="amount" label="Monto" />
              <div class=" mt-[2.25rem]">
                <Button type="submit" color="primary">Donar</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</Page>
