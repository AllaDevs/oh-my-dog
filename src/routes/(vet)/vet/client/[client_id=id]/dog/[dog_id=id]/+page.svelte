<script lang="ts">
  import { breedsToInputOptions } from '$lib/utils/functions.js';
  import { te } from '$lib/utils/translateEnums.js';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';

  import DogForm from '$lib/components/dog/DogForm.svelte';
  import SubmitButton from '$lib/components/form/SubmitButton.svelte';

  export let data;

  let breeds = breedsToInputOptions(data.breeds);

  const updateSForm = superForm(data.updateForm, {
    id: 'update',
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Se actualizo el perro exitosamente', { duration: 3000 });
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

<main
  id="main"
  class="container mx-auto flex max-w-screen-lg flex-col px-6 py-4 pb-8"
>
  <header class="flex w-full items-end justify-between py-2">
    <h2 class=" mt-4 text-2xl">
      Administrar perro {dogIsArchived
        ? '(Este perro se encuentra archivado)'
        : ''}
    </h2>
  </header>

  <article class="flex flex-col gap-8 px-4 justify-around">
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
              <button
                type="button"
                on:click={() => updateSForm.reset()}
                class="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
              >
                Restaurar
              </button>
              <SubmitButton>Actualizar</SubmitButton>
            {/if}
          </svelte:fragment>
        </DogForm>
      </form>
    </section>
    <section>
      <header>
        <h3 class=" text-xl mt-4 lg:mt-10">Historial medico del perro</h3>
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
                Fecha: {medicalRecord.date}
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
            <p class="text-center text-lg font-semibold">
              Sin historial medico
            </p>
          </li>
        {/each}
      </ul>
    </section>
    {#if !dogIsArchived}
      <section>
        <form
          method="POST"
          action="?/archive"
          use:archiveSForm.enhance
          class="flex justify-end p-4"
        >
          <button
            type="submit"
            class="rounded-md bg-red-700/95 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Inhabilitar perro
          </button>
        </form>
      </section>
    {/if}
  </article>
</main>
