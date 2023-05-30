import { AppointmentReason, AppointmentState, Daytime } from '$lib/enums';

export function dayTimeMapper(dayTime: Daytime) {
    switch (dayTime) {
        case Daytime.MORNING:
            return 'Mañana';
        case Daytime.AFTERNOON:
            return 'Tarde';
    }
}

export function appointmentReasonMapper(reason: AppointmentReason) {
    switch (reason) {
        case AppointmentReason.VACCINE:
            return 'Vacuna';
        case AppointmentReason.DEWORMING:
            return 'Desparasitación';
        case AppointmentReason.GENERAL_CONSULTATION:
            return 'Consulta general';
        case AppointmentReason.CASTRATION:
            return 'Castración';
        case AppointmentReason.ANTIRABIC:
            return 'Antirrábica';
    }
}

export function appointmentStateMapper(state: AppointmentState) {
    switch (state) {
        case AppointmentState.CLIENT_REQUEST:
            return 'Solicitud del cliente';
        case AppointmentState.CLIENT_REJECTED:
            return 'Rechazado por el cliente';
        case AppointmentState.VET_REQUEST:
            return 'Solicitud del veterinario';
        case AppointmentState.VET_REJECTED:
            return 'Rechazado por el veterinario';
        case AppointmentState.CONFIRMED:
            return 'Confirmado';
        case AppointmentState.CANCELLED:
            return 'Cancelado';
        case AppointmentState.DONE:
            return 'Realizado';
    }
}
