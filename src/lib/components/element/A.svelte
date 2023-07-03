<script lang="ts">
  const COLOR = {
    default: 'text-gray-700 hover:text-gray-800',
    surface: '',
    primary: 'text-white outline-black',
    secondary: '',
    tertiary: '',
    success: 'text-white outline-black',
    warning: 'text-gray-100 hover:text-white outline-black',
    error: 'text-gray-100 hover:text-white outline-black',
    'error-dark': 'text-gray-100 hover:text-white outline-black',
  };
  const BUTTON_COLOR = {
    default:
      'font-semibold text-gray-700 hover:text-gray-800 bg-gray-300 hover:bg-gray-200',
    surface: 'font-semibold',
    primary:
      'font-semibold text-white bg-teal-600 hover:bg-teal-500 outline-black',
    secondary: 'font-semibold',
    tertiary: 'font-semibold',
    success:
      'font-semibold text-white bg-green-600 hover:bg-green-500 outline-black',
    warning:
      'font-semibold text-gray-100 hover:text-white bg-yellow-600 hover:bg-yellow-500 outline-black',
    error:
      'font-semibold text-gray-100 hover:text-white bg-red-600 hover:bg-red-500 outline-black',
    'error-dark':
      'font-semibold text-gray-100 hover:text-white bg-red-700 hover:bg-red-600 outline-black',
  };

  type Color = keyof typeof COLOR;

  interface $$Props {
    href: string;
    color?: Color;
    button?: true;
    class?: string;
  }

  export let color: Color = 'default';
  export let href: string;
  export let button = false;
</script>

<a
  {href}
  on:click
  class=" rounded-md px-3 py-2 text-sm shadow-sm {(button
    ? BUTTON_COLOR
    : COLOR)[color]} {$$restProps.class ?? ''}"
  class:text-center={button}
>
  <slot>Link to somewhere</slot>
</a>

<style lang="postcss">
  a:hover {
    @apply underline underline-offset-2;
  }

  a:focus-visible {
    @apply outline outline-2 outline-offset-2;
  }
</style>
