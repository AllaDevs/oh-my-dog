<script lang="ts">
  import Button from "$cmp/element/Button.svelte";
  import FieldGroup from "$cmp/form/FieldGroup.svelte";
  import EmailInput from "$cmp/styledInput/EmailInput.svelte";
  import TextInput from "$cmp/styledInput/TextInput.svelte";

  export let id: string;
  export let firstname: string;
  export let lastname: string;
  export let workAreas: string;
  export let workHours: string;
  export let description: string;
  export let logged: boolean;
</script>

<div
  class="flex min-h-full flex-col justify-between items-center rounded border border-teal-500/50 bg-teal-100/25 p-4 md:flex-row md:items-start"
>
  <div>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
      {firstname}
      {lastname}
    </h5>
    <p class="max-w-full break-words"><b>Descripción:</b> {description}</p>
    <p class="max-w-full break-words"><b>Areas:</b> {workAreas}</p>
    <p class="max-w-full break-words"><b>Horarios:</b> {workHours}</p>
  </div>
  <div class="mt-3 gap-2 flex flex-row max-h-min">
    <div>
      {#if logged}
        <form action="?/contact" method="post">
          <input type="text" class="hidden" value={id} name="providerId" />
          {#if logged}
            <Button type="submit" color="primary">Contactar</Button>
          {/if}
        </form>
      {:else}
        <form action="?/anonymousContact" method="post">
          <FieldGroup>
            <svelte:fragment slot="title">
              <h3 class=" text-lg font-semibold text-gray-900">
                Formulario de contacto
              </h3>
            </svelte:fragment>

            <svelte:fragment slot="fields">
              <input type="text" class="hidden" value={id} name="providerId" />
              <TextInput label="Nombre" field="firstname" value="" required />
              <TextInput label="Apellido" field="lastname" value="" required />
              <EmailInput
                label="Direccion de email"
                field="email"
                value=""
                required
              />
            </svelte:fragment>

            <svelte:fragment slot="actions">
              <Button type="submit" color="primary">Contactar</Button>
            </svelte:fragment>
          </FieldGroup>
        </form>
      {/if}
    </div>
  </div>
</div>
