<script lang="ts">
  import DonationsTable from '$cmp/donation/DonationsTable.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import ActionButton from '$lib/components/form/ActionButton.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';
  import TextAreaInput from '$lib/components/form/TextAreaInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { DonationCampaignState } from '$lib/enums.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let campaignState = data.campaign.state;

  const startSForm = superForm(data.startForm, {
    id: 'start',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se resolvio la adopcion con exito', { duration: 3000 });
        campaignState = DonationCampaignState.ACTIVE;
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

  const pauseSForm = superForm(data.startForm, {
    id: 'pause',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se resolvio la adopcion con exito', { duration: 3000 });
        campaignState = DonationCampaignState.PAUSED;
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

  const endSForm = superForm(data.startForm, {
    id: 'end',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se resolvio la adopcion con exito', { duration: 3000 });
        campaignState = DonationCampaignState.ENDED;
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se actualizo el post exitosamente', { duration: 3000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

  $: formIsDisabled = campaignState === DonationCampaignState.ENDED;
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
    <h2 class=" mt-4 text-2xl">
      Edicion campaña de donacion {formIsDisabled && '(Terminada)'}
    </h2>
    <div class="w-max md:self-end my-2">
      <a
        href="/vet/donation/campaign"
        class="rounded-md bg-gray-300 px-3 py-2 text-xs md:text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
      >
        Volver a las campañas
      </a>
    </div>
  </svelte:fragment>

  <section class="mt-4">
    <div class=" grid md:grid-cols-[2fr_1fr]">
      <form
        method="POST"
        action="?/update"
        enctype="multipart/form-data"
        use:updateSForm.enhance
      >
        <FieldGroup cols={1}>
          <svelte:fragment slot="title">
            <slot name="title">
              <h3 class=" text-xl font-semibold text-gray-900">
                Informacion de la campaña
              </h3>
            </slot>
          </svelte:fragment>
          <svelte:fragment slot="fields">
            <TextInput
              label="Nombre"
              form={updateSForm}
              field="name"
              disabled={formIsDisabled}
            />
            <TextAreaInput
              label="Descripcion"
              form={updateSForm}
              field="description"
              disabled={formIsDisabled}
            />
            <ImageInput
              label="Imagen"
              form={updateSForm}
              field="banner"
              disabled={formIsDisabled}
            />
          </svelte:fragment>
          <svelte:fragment slot="actions">
            {#if !formIsDisabled}
              <SubmitButton>Actualizar</SubmitButton>
            {/if}
          </svelte:fragment>
        </FieldGroup>
      </form>
      <div class="flex flex-wrap md:flex-col items-center justify-center">
        {#if campaignState === DonationCampaignState.CREATED || campaignState === DonationCampaignState.PAUSED}
          <ActionButton
            action="?/start"
            enhance={startSForm.enhance}
            color="success"
          >
            {campaignState === DonationCampaignState.CREATED
              ? 'Empezar campaña'
              : 'Reanudar campaña'}
          </ActionButton>
        {/if}
        {#if campaignState === DonationCampaignState.ACTIVE}
          <ActionButton
            action="?/pause"
            enhance={pauseSForm.enhance}
            color="warning"
          >
            Pausar campaña
          </ActionButton>
        {/if}
        {#if campaignState !== DonationCampaignState.CREATED && campaignState !== DonationCampaignState.ENDED}
          <ActionButton
            action="?/end"
            enhance={endSForm.enhance}
            color="error-dark"
          >
            Finalizar campaña
          </ActionButton>
        {/if}
      </div>
    </div>
  </section>

  <section class="mt-4 grid gap-4">
    <h3 class="mt-4 text-xl">Donaciones recibidas</h3>
    <DonationsTable donations={data.campaign.donation} />
  </section>
</Page>
