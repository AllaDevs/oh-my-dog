<script lang="ts">
  import {
    dayTimeMapper,
    appointmentStateMapper,
    appointmentReasonMapper,
  } from '$lib/utils/mappers';
  export let data;
</script>

<p class="text-3xl font-semibold text-gray-900">Mis turnos</p>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {#each data.clientAppointments as appointment}
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6 flex flex-row">
        <div>
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Número de turno
            </dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {appointment.id}
            </dd>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Pedido en
            </dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {appointment.createdAt.toLocaleDateString()}
            </dd>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Última modificación
            </dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {appointment.updatedAt.toLocaleDateString()}
            </dd>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Día del turno
            </dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {appointment.date.toLocaleDateString()}
            </dd>
          </dl>
        </div>
        <div>
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">Horario</dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {dayTimeMapper(appointment.daytime)}
            </dd>
            <dt class="text-sm font-medium text-gray-500 truncate">Motivo</dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {appointmentReasonMapper(appointment.reason)}
            </dd>
            <dt class="text-sm font-medium text-gray-500 truncate">
              Id del Perro
            </dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {appointment.dogId}
            </dd>
            <dt class="text-sm font-medium text-gray-500 truncate">Estado</dt>
            <dd class="mt-1 text-xl font-semibold text-gray-900">
              {appointmentStateMapper(appointment.state)}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  {/each}
</div>
