import { AppointmentReason, AppointmentState, Daytime, DogSex, DogSize } from '$lib/enums';


class EnumTranslationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TranslationError';
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
            return 'Solicitud enviada';
        case AppointmentState.CLIENT_REJECTED:
            return 'Solicitud rechazada';
        case AppointmentState.VET_REQUEST:
            return 'Solicitud recibida';
        case AppointmentState.VET_REJECTED:
            return 'Solicitud rechazada';
        case AppointmentState.CONFIRMED:
            return 'Confirmada';
        case AppointmentState.CANCELLED:
            return 'Cancelada';
        case AppointmentState.DONE:
            return 'Realizada';
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


const translationEnum = {
    AppointmentReason: tAppointmentReason,
    AppointmentState: tAppointmentState,
    Daytime: tDayTime,
    DogSex: tDogSex,
    DogSize: tDogSize,
};

export default translationEnum;
export { translationEnum as te }
