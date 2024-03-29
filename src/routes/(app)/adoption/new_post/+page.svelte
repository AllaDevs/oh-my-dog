<script lang="ts">
  import { dev } from '$app/environment';
  import { enhance } from '$app/forms';
  import Button from '$cmp/element/Button.svelte';
  import DateInput from '$cmp/form/DateInput.svelte';
  import SelectInput from '$cmp/form/SelectInput.svelte';
  import TextInput from '$cmp/form/TextInput.svelte';
  import Page from '$cmp/layout/Page.svelte';
  import { DogSex, DogSize } from '$lib/enums.js';
  import { getYMDAR } from '$lib/utils/functions.js';
  import type { SubmitFunction } from '@sveltejs/kit';
  import toast from 'svelte-french-toast';
  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  export let data;

  let breeds: { value: string; text: string }[] = [];
  for (const breed of data.breeds) {
    breeds.push({ value: breed.id, text: breed.name });
  }

  const today = getYMDAR(new Date());
  const sForm = superForm(data.form, {
    id: 'newDog',
    // onResult: ({ result }) => {
    //   if (result.type === 'success') {
    //     toast.success('Perro para adopción registrado con exito');
    //     return;
    //   }
    // if (result.type === 'error') {
    //   toast.error(String(result.message));
    //   return;
    // }
    // },
    onUpdated: ({ form }) => {
      if (form.valid) {
        toast.success('Perro para adopción registrado con exito');
      } else if (form.errors._errors) {
        toast.error(String(form.errors._errors), { duration: 10000 });
      }
    },
  });

  const form = sForm.form;
  const enhanceMyDogForm = (() => {
    return async ({ result }) => {
      switch (result.type) {
        case 'success': {
          data.clientDogs.splice(
            data.clientDogs.findIndex(
              (dog) => dog.id === result.data?.form?.data?.dogId
            ),
            1
          );
          data.clientDogs = data.clientDogs;
          toast.success('Perro para adopción registrado con exito');
          break;
        }
        case 'failure': {
          toast.error(
            String(
              result.data?.form.errors.dogId ??
                result.data?.form.errors._errors ??
                'Ocurrio un error inesperado al registrar el perro para adopcion'
            )
          );
          break;
        }
        case 'error': {
          toast.error(String(result.error));
          break;
        }
      }
    };
  }) satisfies SubmitFunction;
</script>

<svelte:head>
  <title>Dar en adopcion</title>
</svelte:head>

<Page
  classContainer="container mx-auto max-w-screen-lg p-4"
  classHeaderSlot="mt-2"
  classContentSlot="flex flex-col gap-8 px-4 justify-around lg:flex-row"
>
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Nueva publicaicon de adopcion</h2>
  </svelte:fragment>

  <section class="">
    <h3 class="mt-4 text-xl font-semibold">
      Dar en adopcion un perro registrado
    </h3>
    <ul class="flex flex-col justify-center">
      {#each data.clientDogs as dog (dog.id)}
        <li>
          <form
            method="POST"
            action="?/existingDog"
            use:enhance={enhanceMyDogForm}
          >
            <input type="text" name="dogId" value={dog.id} hidden />
            <input type="text" value={dog.name} />
            <Button type="submit" color="primary">Dar en adopcion</Button>
          </form>
        </li>
      {:else}
        <li>
          <p class=" text-gray-700">
            No tienes perros para dar en adopcion en este momento
          </p>
        </li>
      {/each}
    </ul>
  </section>

  <section class="">
    <h3 class="mt-4 text-xl font-semibold">Dar en adopcion un nuevo perro</h3>
    <form method="POST" action="?/newDog" class="mt-4" use:sForm.enhance>
      <TextInput label="Nombre" form={sForm} field="name" />
      <DateInput
        label="Nacimiento estimado"
        form={sForm}
        field="birthdate"
        max={today}
      />
      <SelectInput
        label="Tamaño"
        form={sForm}
        field="size"
        options={[
          { value: DogSize.SMALL, text: 'Pequeño' },
          { value: DogSize.MEDIUM, text: 'Mediano' },
          { value: DogSize.BIG, text: 'Grande' },
        ]}
      />
      <SelectInput
        label="Sexo"
        form={sForm}
        field="sex"
        options={[
          { value: DogSex.FEMALE, text: 'Hembra' },
          { value: DogSex.MALE, text: 'Macho' },
        ]}
      />
      <TextInput label="Color" form={sForm} field="color" />
      <TextInput label="Observación" form={sForm} field="observation" />
      <SelectInput label="Raza" form={sForm} field="breedId" options={breeds} />
      <div class=" flex justify-around mt-4">
        <Button type="submit" color="primary">Dar en adopcion</Button>
      </div>
    </form>

    {#if dev}
      <SuperDebug data={$form} />
    {/if}
  </section>
</Page>
