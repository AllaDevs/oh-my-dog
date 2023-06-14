<script lang="ts">
  const COLOR = {
    default:
      'text-gray-700 hover:text-gray-800 bg-gray-300 enabled:hover:bg-gray-200',
    surface: '',
    primary: 'text-white bg-teal-600 enabled:hover:bg-teal-500 outline-black',
    secondary: '',
    tertiary: '',
    success: 'text-white bg-green-600 enabled:hover:bg-green-500 outline-black',
    warning:
      'text-gray-100 enabled:hover:text-white bg-yellow-600 enabled:hover:bg-yellow-500 outline-black',
    error:
      'text-gray-100 enabled:hover:text-white bg-red-600 enabled:hover:bg-red-500 outline-black',
    'error-dark':
      'text-gray-100 enabled:hover:text-white bg-red-700 enabled:hover:bg-red-600 outline-black',
  };

  type ButtonType = 'button' | 'reset' | 'submit';

  interface $$Props {
    color?: keyof typeof COLOR;
    type?: ButtonType;
    formaction?: string;
    disabled?: boolean;
  }

  export let type: ButtonType = 'button';
  export let formaction: string | undefined = undefined;
  export let disabled = false;
  export let color: keyof typeof COLOR = 'default';
</script>

<button
  {type}
  {formaction}
  {disabled}
  on:click
  class=" rounded-md px-3 py-2 text-sm font-semibold shadow-sm {COLOR[color]}"
>
  <slot>Touch me</slot>
</button>

<style lang="postcss">
  button:focus-visible {
    @apply outline outline-2 outline-offset-2;
  }
  button:disabled {
    @apply cursor-not-allowed opacity-75;
  }
</style>
