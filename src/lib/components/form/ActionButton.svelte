<script lang="ts">
  const COLORS = {
    default: 'text-gray-700 bg-gray-300 hover:bg-gray-200',
    surface: '',
    primary: 'text-white bg-teal-600 hover:bg-teal-500 outline-black',
    secondary: '',
    tertiary: '',
    success: 'text-white bg-green-600 hover:bg-green-500 outline-black',
    warning:
      'text-gray-100 hover:text-white bg-yellow-600 hover:bg-yellow-500 outline-black',
    error:
      'text-gray-100 hover:text-white bg-red-600 hover:bg-red-500 outline-black',
    'error-dark':
      'text-gray-100 hover:text-white bg-red-700 hover:bg-red-600 outline-black',
  };

  interface $$Props {
    action: string;
    color: keyof typeof COLORS;
    enhance: (node: HTMLFormElement) => { destroy(): void };
  }

  export let action: string;

  export let enhance = (node: HTMLFormElement) => {
    return { destroy() {} };
  };

  export let color: keyof typeof COLORS = 'default';
</script>

<form
  method="POST"
  {action}
  use:enhance
  class="p-2 md:p-4 {$$restProps.class ?? ''}"
>
  <button
    type="submit"
    class="rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 {COLORS[
      color
    ]}"
  >
    <slot>Submit</slot>
  </button>
</form>
