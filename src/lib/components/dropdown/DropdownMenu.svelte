<script lang="ts">
  import { clickOutside } from '$lib/action';
  import { slide } from 'svelte/transition';

  const COMPONENT_ID = crypto.randomUUID();

  export let label: string;
  export let open = false;

  let isOpen = open;
  let toggleButton: HTMLButtonElement;

  function toggleOpen() {
    isOpen = !isOpen;
  }
</script>

<div class=" grid relative w-fit">
  <button
    bind:this={toggleButton}
    on:click={toggleOpen}
    aria-expanded={isOpen}
    aria-controls="dropdown-menu-{COMPONENT_ID}"
    class=" relative flex cursor-pointer items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
  >
    <h4 class="">{label}</h4>

    <div class="grid relative place-items-center w-4 ml-2">
      <span
        class="absolute text-base transition-transform duration-[500ms] {isOpen
          ? 'rotate-90'
          : ''}">></span
      >
    </div>
  </button>

  {#if isOpen}
    <div
      use:clickOutside={{
        onEvent: toggleOpen,
        ignoredNodes: [toggleButton],
        once: true,
      }}
      transition:slide|local
      role="region"
      aria-hidden={!isOpen}
      aria-labelledby="dropdown-menu-{COMPONENT_ID}"
      class=" z-10 absolute top-[120%] right-0"
    >
      <ul
        class=" bg-teal-100 py-4 px-2 rounded border border-gray-900 grid gap-1"
      >
        <slot name="items" />
      </ul>
    </div>
  {/if}
</div>
