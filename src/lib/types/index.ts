export type * from './posts';

import type { AppointmentReason, AppointmentState, Daytime } from '../enums';

export type DateString = `${number}-${number}-${number}`;

export type Appointment = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    daytime: Daytime;
    state: AppointmentState;
    reason: AppointmentReason;

    dog: {
        id: string;
        birthdate: Date;
        name: string;
    };
    dogId: string;
}
