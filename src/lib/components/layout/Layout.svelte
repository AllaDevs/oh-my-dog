<script>
  export let regionPage = "";
  export let slotHeader = 'z-10';
  export let slotSidebarLeft = 'w-auto';
  export let slotSidebarRight = 'w-auto';
  export let slotFooter = '';
  const cBaseAppShell = 'w-full h-full flex flex-col overflow-hidden';
  const cContentArea = 'w-full h-full flex overflow-hidden';
  const cPage = "flex-1 overflow-x-hidden flex flex-col";
  const cSidebarLeft = 'flex-none overflow-x-hidden overflow-y-auto';
  const cSidebarRight = 'flex-none overflow-x-hidden overflow-y-auto';
  
  $: classesBase = `${cBaseAppShell} ${$$props.class ?? ''}`;
  $: classesHeader = `${slotHeader}`;
  $: classesSidebarLeft = `${cSidebarLeft} ${slotSidebarLeft}`;
  $: classesSidebarRight = `${cSidebarRight} ${slotSidebarRight}`;
  $: classesFooter = `${slotFooter}`;
</script>

<div class={classesBase}>
  {#if $$slots.header}
    <header class="flex-none {classesHeader}"><slot name="header" /></header>
  {/if}

  <div class="flex-auto {cContentArea}">
    {#if $$slots.sidebarLeft}
      <aside class={classesSidebarLeft}><slot name="sidebarLeft" /></aside>
    {/if}

    <slot name="main">
      <main id="main" class="{regionPage} {cPage}" on:scroll>
        <slot />
      </main>
    </slot>

    {#if $$slots.sidebarRight}
      <aside class={classesSidebarRight}><slot name="sidebarRight" /></aside>
    {/if}
  </div>

  {#if $$slots.footer}
    <footer class="flex-none {classesFooter}"><slot name="footer" /></footer>
  {/if}
</div>
