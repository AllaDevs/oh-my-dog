<script lang="ts">
    import type { PageData } from './$types';

  export let data: PageData;

</script>
Administracion para veterinarios

<!-- render clients on nice card -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each data.clients as client}
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <dl>
          <dt class="text-sm font-medium text-gray-500 truncate">
            {client.username}
          </dt>
          <dd class="mt-1 text-3xl font-semibold text-gray-900">
            {client.lastname}
          </dd>
        </dl>
      </div>
    </div>
  {/each}
</div>
