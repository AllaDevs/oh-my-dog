<script lang="ts">
  import { enhance as _enhance } from '$app/forms';
  import ActionButton from '$cmp/form/ActionButton.svelte';
  import { toast } from 'svelte-french-toast';

  type Service =
    | {
        status: 'ok';
        time: number;
      }
    | {
        status: 'error';
        time: number;
        error: string;
      };

  export let name: string;
  export let service: Service;
  export let refreshAction: string;

  let lastUpdate: number;

  $: service && (lastUpdate = Date.now());

  const enhance = (el: HTMLFormElement) =>
    _enhance(el, () => {
      return async ({ result }) => {
        lastUpdate = Date.now();
        switch (result.type) {
          case 'success': {
            service = result.data?.service as any;
            toast.success(`Service ${name} updated`, { duration: 3000 });
            break;
          }
          case 'failure': {
            toast.error(`Failed to update service ${name}`, { duration: 3000 });
            break;
          }
          case 'error': {
            toast.error(String(result.error), { duration: 5000 });
            break;
          }
        }
      };
    });
</script>

<div class=" border border-gray-900/75 px-4 py-3 rounded shadow flex">
  <div class="flex-1">
    <h4 class="font-semibold">Service: {name}</h4>
    <p class="text-gray-900/75">
      Status: {service.status === 'ok' ? 'Online' : 'Offline'}
    </p>
    <p class="text-gray-900/75">
      Response time: {service.time}ms
    </p>
    <p class="text-gray-900/75">
      Last update: {new Date(lastUpdate).toLocaleTimeString()}
    </p>
  </div>

  <ActionButton
    action={refreshAction}
    color="primary"
    class="!p-0 self-end justify-self-end"
    {enhance}
  >
    Refresh
  </ActionButton>
</div>

<!-- <pre><code
  class="block whitespace-pre overflow-x-scroll scrollbar max-w-[75vw]"
  >{JSON.stringify(error, null, 2)}</code
></pre> -->
