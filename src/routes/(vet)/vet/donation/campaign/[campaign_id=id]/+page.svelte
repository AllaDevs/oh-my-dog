<script lang="ts">
  import DonationsTable from '$cmp/donation/DonationsTable.svelte';
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import ActionButton from '$lib/components/form/ActionButton.svelte';
  import FieldGroup from '$lib/components/form/FieldGroup.svelte';
  import ImageInput from '$lib/components/form/ImageInput.svelte';
  import TextAreaInput from '$lib/components/form/TextAreaInput.svelte';
  import TextInput from '$lib/components/form/TextInput.svelte';
  import { DonationCampaignState } from '$lib/enums';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let campaignState = data.campaign.state;

  const startSForm = superForm(data.startForm, {
    id: 'start',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se comenzo la campaña con exito', { duration: 3000 });
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
        toast.success('Se pauso la campaña con exito', { duration: 3000 });
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
        toast.success('Se termino la campaña con exito', { duration: 3000 });
        campaignState = DonationCampaignState.ENDED;
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onSubmit: (input) => {
      // NETLIFY: temporary fix because of size limit in request body ~6MB
      let file = (input.formElement[2] as HTMLInputElement | null)?.files?.item(
        0
      );
      if (file && file.size > 4000000) {
        alert(
          'La imagen seleccionada es demasiado grande, por favor seleccione una imagen de menos de 4MB (4 Megabytes)'
        );
        input.cancel();
      }
    },
    onError: (error) => {
      toast.error(
        `Ocurrio un error inesperado durante la creacion de la campaña, intenta cambiando de imagen o mas tarde`,
        { duration: 5000 }
      );
      console.error(
        `Error during form submission at vet/donation/campaign/new/+page.svelte, result:\n${error.result}`
      );
    },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se actualizo la campaña exitosamente', {
          duration: 3000,
        });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 5000 });
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
      Edicion campaña de donacion {formIsDisabled ? '(Terminada)' : ''}
    </h2>
    <div class="w-max md:self-end my-2">
      <A href="/vet/donation" color="default" button>Volver a las campañas</A>
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
        <FieldGroup cols="1">
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
              <Button type="submit" color="primary">Actualizar</Button>
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
