import { AppointmentReason, AppointmentState, Day, Daytime, DogSex, DogSize, DonationReason } from '$lib/enums';
import { DogServiceType } from '@prisma/client';


class EnumTranslationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TranslationError';
    }
}

function tProviderType(type: DogServiceType) {
    switch (type) {
        case DogServiceType.WALKING:
            return 'Paseador';
        case DogServiceType.SITTING:
            return 'Cuidador';
        default:
            throw new EnumTranslationError(`Invalid provider type: ${type}`);
    }
}

function tDayTime(dayTime: Daytime) {
    switch (dayTime) {
        case Daytime.MORNING:
            return 'Mañana';
        case Daytime.AFTERNOON:
            return 'Tarde';
        default:
            throw new EnumTranslationError(`Invalid day time: ${dayTime}`);
    }
}

function tAppointmentReason(reason: AppointmentReason) {
    switch (reason) {
        case AppointmentReason.ANTIRABIC:
            return 'Antirrábica';
        case AppointmentReason.CASTRATION:
            return 'Castración';
        case AppointmentReason.DEWORMING:
            return 'Desparasitación';
        case AppointmentReason.VACCINE:
            return 'Vacuna';
        case AppointmentReason.GENERAL_CONSULTATION:
            return 'Consulta general';
        default:
            throw new EnumTranslationError(`Invalid appointment reason: ${reason}`);
    }
}

function tAppointmentState(state: AppointmentState) {
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
        default:
            throw new EnumTranslationError(`Invalid appointment state: ${state}`);
    }
}

function tDogSex(sex: DogSex) {
    switch (sex) {
        case DogSex.MALE:
            return 'Macho';
        case DogSex.FEMALE:
            return 'Hembra';
        default:
            throw new EnumTranslationError(`Invalid dog sex: ${sex}`);
    }
}

function tDogSize(size: DogSize) {
    switch (size) {
        case DogSize.SMALL:
            return 'Pequeño';
        case DogSize.MEDIUM:
            return 'Mediano';
        case DogSize.BIG:
            return 'Grande';
        default:
            throw new EnumTranslationError(`Invalid dog size: ${size}`);
    }
}

function tDay(day: Day) {
    switch (day) {
        case Day.MONDAY:
            return 'Lunes';
        case Day.TUESDAY:
            return 'Martes';
        case Day.WEDNESDAY:
            return 'Miércoles';
        case Day.THURSDAY:
            return 'Jueves';
        case Day.FRIDAY:
            return 'Viernes';
        case Day.SATURDAY:
            return 'Sábado';
        case Day.SUNDAY:
            return 'Domingo';
        default:
            throw new EnumTranslationError(`Invalid day: ${day}`);
    }
}

function tDonationReason(reason: DonationReason) {
    switch (reason) {
        case DonationReason.GENERAL:
            return 'General';
        case DonationReason.CAMPAIGN:
            return 'Campaña';
        default:
            throw new EnumTranslationError(`Invalid donation reason: ${reason}`);
    }
}


const translationEnum = {
    AppointmentReason: tAppointmentReason,
    AppointmentState: tAppointmentState,
    Daytime: tDayTime,
    DogSex: tDogSex,
    DogSize: tDogSize,
    Day: tDay,
    DonationReason: tDonationReason,
    DogServiceType: tProviderType,
};

export default translationEnum;
export { translationEnum as te };
