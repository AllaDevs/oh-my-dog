import type { Daytime, AppointmentReason, AppointmentState } from '$lib/enums';

export function dayTimeMapper(dayTime: Daytime): string {
    switch (dayTime) {
        case 'MORNING':
            return 'Mañana';
        case 'AFTERNOON':
            return 'Tarde';
    }
}

export function appointmentReasonMapper(reason: AppointmentReason): string {
    switch (reason) {
        case 'VACCINE':
            return 'Vacuna';
        case 'DEWORMING':
            return 'Desparasitación';
        case 'GENERAL_CONSULTATION':
            return 'Consulta general';
        case 'CASTRATION':
            return 'Castración';
        case 'ANTIRABIC':
            return 'Antirrábica';
    }
}

export function appointmentStateMapper(state: AppointmentState): string {
    switch (state) {
        case 'CLIENT_REQUEST':
            return 'Solicitud del cliente';
        case 'CLIENT_REJECTED':
            return 'Rechazada por el cliente';
        case 'VET_REQUEST':
            return 'Solicitud del veterinario';
        case 'VET_REJECTED':
            return 'Rechazada por el veterinario';
        case 'CONFIRMED':
            return 'Confirmada';
        case 'CANCELLED':
            return 'Cancelada';
        case 'DONE':
            return 'Realizada';
    }
}
