<script lang="ts">
  import { page } from '$app/stores';
  import SiteLogo from './SiteLogo.svelte';

  type NavLink = {
    href: string;
    text: string;
    requiresLogin?: boolean;
  };

  export let homePath: string;
  export let navLinks: NavLink[] = [];
  export let navLinksOnHome: boolean | undefined = true;

  $: onHome = $page.url.pathname === homePath;
  $: user = $page.data.user;
</script>

<div
  class=" header flex w-full justify-between bg-teal-100 px-4 overflow-y-auto"
>
  <div>
    <slot name="left">
      <slot name="beforeLogo">
        <!-- <button class="btn btn-sm mr-4 lg:hidden">
          <span>
            <svg viewBox="0 0 100 80" class="fill-token h-4 w-4">
              <rect width="100" height="20" />
              <rect y="30" width="100" height="20" />
              <rect y="60" width="100" height="20" />
            </svg>
          </span>
        </button> -->
      </slot>
      <SiteLogo link={onHome ? '#main' : homePath} onLink={onHome} />
      <slot name="afterLogo" />
    </slot>
  </div>

  <slot>
    {#if navLinks.length}
      <nav
        aria-label="Main navigation"
        class=" mx-auto hidden max-w-5xl scrollbar items-center justify-between md:flex lg:px-8 overflow-auto"
      >
        <ul class=" flex" class:hidden={!navLinksOnHome && onHome}>
          <slot name="navLinks">
            {#each navLinks as { href, text, requiresLogin }}
              {@const current = $page.url.pathname === href}
              {#if !requiresLogin || user}
                <li class=" w-max p-1 sm:p-2 md:px-4">
                  <a
                    aria-current={current ? 'page' : false}
                    href={current ? '#main' : href}
                    class=" font-medium rounded p-2 underline-offset-2 hover:text-gray-800 hover:underline"
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
</style>
