<script>
  export let classContainer = '';
  export let classHeaderSlot = '';
  export let classContentSlot = '';
  export let classFooterSlot = '';

  const cPage = 'overflow-x-hidden flex flex-col flex-1';

  $: classesPageHeader = `${classHeaderSlot}`;
  $: classesPageContent = `${classContentSlot}`;
  $: classesPageFooter = `${classFooterSlot}`;
</script>

<main id="main" class="{classContainer} {cPage}">
  {#if $$slots.pageHeader}
    <header class="flex-none {classesPageHeader}">
      <slot name="pageHeader">(slot:header)</slot>
    </header>
  {/if}

  <div class="flex-auto {classesPageContent}">
    <slot />
  </div>

  {#if $$slots.pageFooter}
    <footer class="flex-none {classesPageFooter}">
      <slot name="pageFooter">(slot:footer)</slot>
    </footer>
  {/if}
</main>

<!--
@component
A utility component to simplify the layout of a `+page.svelte`.

Default classes:
```tsx
classContainer = "overflow-x-hidden flex flex-col flex-1"
classHeaderSlot = "flex-none"
classContentSlot = "flex-auto"
classFooterSlot = "flex-none"
```

Example:
```tsx
<Page classContainer="container mx-auto px-6 py-4" classContentSlot="px-4 py-2">
  <svelte:fragment slot="pageHeader">
    <h2 class=" mt-4 text-2xl">Donaciones</h2>
  </svelte:fragment>

  <section class="grid gap-4">
    <h3 class=" text-xl mt-4 lg:mt-10">Campañas de donacion</h3>
    <div class=" max-w-xs">
      <PageCard href="/vet/donation/campaign">
        <h3 slot="header" class="h3">Ver listado</h3>
        <p slot="content" />
      </PageCard>
    </div>
  </section>

  <section class="grid gap-4">
    <h3 class=" text-xl mt-4 lg:mt-10">Donaciones generales</h3>
    <DonationsTable donations={data.generalDonations} />
  </section>
</Page>
```
-->
