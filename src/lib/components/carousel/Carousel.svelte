<script lang="ts">
  import type {
    ComponentProps,
    ComponentType,
    SvelteComponentTyped,
  } from 'svelte';

  type T = $$Generic<SvelteComponentTyped>;

  export let component: ComponentType<T>;
  export let props: ComponentProps<T>[];
</script>

<ul
  class="border-pink-500 justify-between py-4 masked-overflow flex scrollbar w-full snap-x snap-mandatory gap-6 overflow-x-auto before:w-[2rem] before:shrink-0 after:w-[2rem] after:shrink-0"
>
  {#each props as prop}
    <li
      class="flex-shrink-0 snap-center w-[90%] h-[30vh] md:w-[30%] lg:w-[40%]"
    >
      <svelte:component this={component} {...prop} />
    </li>
  {/each}
</ul>

<style>
  .masked-overflow {
    /* scroll bar width, for use in mask calculations */
    --scrollbar-width: 8px;

    /* mask fade distance, for use in mask calculations */
    --mask-width: 32px;

    /* If content exceeds width of container, overflow! */
    overflow-x: auto;

    /* Our width limit */
    /* width: 300px; */

    /* Need to make sure container has right space,
  otherwise content at the right is always faded out */
    padding-right: var(--mask-width);

    /* Keep some space between content and scrollbar */
    padding-bottom: 20px;

    /* The CSS mask */

    /* The content mask is a linear gradient from left to right */
    --mask-image-content: linear-gradient(
      to right,
      transparent,
      black var(--mask-width),
      black calc(100% - var(--mask-width)),
      transparent
    );

    /* Here we scale the content gradient to the height of the container 
  minus the scrollbar width. The width is the full container width */
    --mask-size-content: 100% calc(100% - var(--scrollbar-width));

    /* The scrollbar mask is a black pixel */
    --mask-image-scrollbar: linear-gradient(black, black);

    /* The height of our black pixel is the height of the scrollbar.
  The width is the full container width */
    --mask-size-scrollbar: 100% var(--scrollbar-width);

    /* Apply the mask image and mask size variables */
    mask-image: var(--mask-image-content), var(--mask-image-scrollbar);
    mask-size: var(--mask-size-content), var(--mask-size-scrollbar);

    /* Position the content gradient in the top left, and the 
  scroll gradient in the bottom left */
    mask-position: 0 0, 0 100%;

    /* We don't repeat our mask images */
    mask-repeat: no-repeat, no-repeat;
  }
</style>
