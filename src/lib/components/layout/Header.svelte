<script lang="ts">
  import { page } from '$app/stores';
  import { clickOutside } from '$lib/action';
  import { slide } from 'svelte/transition';
  import SiteLogo from './SiteLogo.svelte';

  type NavLink = {
    href: string;
    text: string;
    requiresLogin?: boolean;
    warning?: boolean;
  };

  export let homePath: string;
  export let navLinks: NavLink[] = [];
  export let navLinksOnHome: boolean | undefined = true;

  $: onHome = $page.url.pathname === homePath;
  $: user = $page.data.user;

  const NAV_ID = 'main-nav';

  let menuOpen = false;
  let menuToggle: HTMLButtonElement;
</script>

<div
  class="header flex w-full justify-between px-4 bg-teal-100 shadow-border-b"
>
  <div>
    <slot name="left">
      <slot name="beforeLogo">
        {#if navLinks.length}
          <button
            aria-expanded={menuOpen}
            aria-controls={NAV_ID}
            on:click={() => (menuOpen = !menuOpen)}
            bind:this={menuToggle}
            class="p-1 mr-2 lg:hidden"
          >
            <span>
              <svg viewBox="0 0 100 80" class=" fill-gray-900 h-5 w-5">
                <rect width="100" height="20" />
                <rect y="30" width="100" height="20" />
                <rect y="60" width="100" height="20" />
              </svg>
            </span>
          </button>
        {/if}
      </slot>
      <SiteLogo link={onHome ? '#main' : homePath} onLink={onHome} />
      <slot name="afterLogo" />
    </slot>
  </div>

  <slot>
    {#if navLinks.length}
      <nav
        aria-label="Main navigation"
        class=" hidden lg:flex lg:px-8 mx-auto scrollbar overflow-auto"
      >
        <ul class=" flex items-center" class:hidden={!navLinksOnHome && onHome}>
          <slot name="navLinks">
            {#each navLinks as { href, text, requiresLogin, warning }}
              {@const current = $page.url.pathname === href}
              {#if !requiresLogin || user}
                <li class=" w-max p-1 sm:p-2 md:px-4">
                  <a
                    aria-current={current ? 'page' : false}
                    href={current ? '#main' : href}
                    class="nav-link-text p-2"
                  >
                    {text}
                  </a>
                </li>
              {/if}
            {/each}
          </slot>
        </ul>
      </nav>
      {#if menuOpen}
        <nav
          aria-label="Main navigation"
          id={NAV_ID}
          transition:slide|local
          use:clickOutside={{
            onEvent: () => (menuOpen = false),
            ignoredNodes: [menuToggle],
          }}
          class="lg:hidden absolute top-[calc(3.5rem_+_1px)] sm:top-[calc(4rem_+_1px)] bg-teal-50 left-0 w-full z-10 shadow-border-b"
        >
          <ul class=" flex flex-col p-4 bg-teal-100/75">
            <slot name="navLinks">
              {#each navLinks as { href, text, requiresLogin }}
                {@const current = $page.url.pathname === href}
                {#if !requiresLogin || user}
                  <li>
                    <a
                      aria-current={current ? 'page' : false}
                      href={current ? '#main' : href}
                      class="nav-link-text block text-lg px-4 py-2"
                    >
                      {text}
                    </a>
                  </li>
                {/if}
              {/each}
            </slot>
          </ul>
        </nav>
      {/if}
    {/if}
  </slot>

  <div>
    <slot name="right" />
  </div>
</div>

<style lang="postcss">
  .header > div {
    @apply flex items-center p-1 sm:p-2;
  }

  .header:global(.header-item) {
    @apply p-1 sm:p-2;
  }

  .scrollbar::-webkit-scrollbar {
    @apply h-1;
  }

  .shadow-border-b {
    box-shadow: 0 0 0 1px theme(colors.gray.900);
  }

  .nav-link-text {
    @apply font-medium text-gray-900 hover:text-black underline-offset-2 hover:underline;
  }
</style>
