<script lang="ts">
  import A from '$cmp/element/A.svelte';
  import Button from '$cmp/element/Button.svelte';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import DogForm from '$lib/components/dog/DogForm.svelte';
  import {
    breedsToInputOptions,
    friendlyDateARG,
  } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  export let data;

  let breeds = breedsToInputOptions(data.breeds);

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se actualizó el perro exitosamente', { duration: 3000 });
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors));
      }
    },
  });

  let dogIsArchived = data.dog.archived;
  let readonly: Record<string, true> | undefined = data.dog.archived
    ? {
        name: true,
        birthdate: true,
        size: true,
        sex: true,
        color: true,
        observation: true,
        breedId: true,
      }
    : undefined;
  const archiveSForm = superForm(data.archiveForm, {
    id: 'archive',
    onResult: ({ result }) => {
      switch (result.type) {
        case 'redirect': {
          toast.success('Se archivo el perro exitosamente', { duration: 3000 });
          dogIsArchived = true;
          break;
        }
        case 'success': {
          toast.success('Se archivo el perro exitosamente', { duration: 3000 });
          dogIsArchived = true;
          readonly = {
            name: true,
            birthdate: true,
            size: true,
            sex: true,
            color: true,
            observation: true,
            breedId: true,
          };
          break;
        }
        default:
          break;
      }
    },
  });
</script>

<svelte:head>
  <title>Administrar perro</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg px-6 py-4 pb-8 scrollbar"
  classHeaderSlot="py-2"
  classContentSlot="flex flex-col gap-8 mt-4 px-4 justify-around"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">
      Administrar perro {dogIsArchived ? '(Archivado)' : ''}
    </h2>
  </svelte:fragment>

  <section class="flex flex-col gap-4">
    <form method="POST" action="?/update" use:updateSForm.enhance>
      <DogForm sForm={updateSForm} {breeds} readonlyFields={readonly}>
        <svelte:fragment slot="title">
          <h3 class=" text-lg font-semibold text-gray-900">
            Informacion del perro
          </h3>
        </svelte:fragment>

        <svelte:fragment slot="actions">
          {#if !dogIsArchived}
            <Button on:click={() => updateSForm.reset()} color="default">
              Restaurar
            </Button>
            <Button type="submit" color="primary">Actualizar</Button>
          {/if}
        </svelte:fragment>
      </DogForm>
    </form>
  </section>

  <section>
    <header class="flex justify-between">
      <h3 class=" text-xl mt-4 lg:mt-10">
        Historial medico de {data.dog.name}
      </h3>
      <div class="self-end mb-1">
        <A
          href="/api/pdf/dog/{data.dog.id}"
          type="application/pdf"
          target="_blank"
          color="primary"
          button
        >
          Descargar PDF
        </A>
      </div>
    </header>

    <ul
      class=" mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:mt-10 lg:grid-cols-3"
    >
      {#each data.dog.medicalRecord as medicalRecord}
        <li
          class=" flex min-h-full transition-transform hover:scale-105 justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
        >
          <div class=" flex flex-col">
            <p class="text-center text-lg font-semibold">
              Motivo: {te.AppointmentReason(medicalRecord.reason)}
            </p>
            <p class="text-center text-lg font-semibold">
              Fecha: {friendlyDateARG(medicalRecord.date).split(',')[0]}
            </p>
            <p class="text-center text-lg font-semibold">
              Observacion: {medicalRecord.observation ??
                'Sin observacion de la consulta'}
            </p>
          </div>
        </li>
      {:else}
        <li
          class=" opacity-75 flex min-h-full justify-around rounded border border-teal-500/50 bg-teal-100/25 p-4 hover:border-teal-500 hover:bg-teal-100/50"
        >
          <p class="text-center text-lg font-semibold">Sin historial medico</p>
        </li>
      {/each}
    </ul>
  </section>

  {#if !dogIsArchived}
    <section>
      <ActionButton
        action="?/archive"
        color="error"
        enhance={archiveSForm.enhance}
      >
        Archivar perro
      </ActionButton>
    </section>
  {/if}
</Page>
