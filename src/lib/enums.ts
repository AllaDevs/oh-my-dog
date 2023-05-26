/**
 * This file contains all the enums that are used in the project.
 *
 * The enums are generated into '@prisma/client' based on the schema.prisma file.
 * The problem is that the generated enums cause import path issues when used in frontend code.
 * So we have to redeclare them here.
 */
import type * as prismaClient from '@prisma/client';

export const AppointmentReason = {
    VACCINE: 'VACCINE',
    ANTIRABIC: 'ANTIRABIC',
    DEWORMING: 'DEWORMING',
    CASTRATION: 'CASTRATION',
    GENERAL_CONSULTATION: 'GENERAL_CONSULTATION'
} satisfies typeof prismaClient.AppointmentReason;

export type AppointmentReason = (typeof AppointmentReason)[keyof typeof AppointmentReason];

export const AppointmentState = {
    CLIENT_REQUEST: 'CLIENT_REQUEST',
    CLIENT_REJECTED: 'CLIENT_REJECTED',
    VET_REQUEST: 'VET_REQUEST',
    VET_REJECTED: 'VET_REJECTED',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
    DONE: 'DONE'
} satisfies typeof prismaClient.AppointmentState;

export type AppointmentState = (typeof AppointmentState)[keyof typeof AppointmentState];

export const Day = {
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
    SUNDAY: 'SUNDAY'
} satisfies typeof prismaClient.Day;

export type Day = (typeof Day)[keyof typeof Day];

export const Daytime = {
    MORNING: 'MORNING',
    AFTERNOON: 'AFTERNOON'
} satisfies typeof prismaClient.Daytime;

export type Daytime = (typeof Daytime)[keyof typeof Daytime];

export const DogServiceType = {
    SITTING: 'SITTING',
    WALKING: 'WALKING'
} satisfies typeof prismaClient.DogServiceType;

export type DogServiceType = (typeof DogServiceType)[keyof typeof DogServiceType];

export const DogSex = {
    MALE: 'MALE',
    FEMALE: 'FEMALE'
} satisfies typeof prismaClient.DogSex;

export type DogSex = (typeof DogSex)[keyof typeof DogSex];

export const DogSize = {
    SMALL: 'SMALL',
    MEDIUM: 'MEDIUM',
    BIG: 'BIG'
} satisfies typeof prismaClient.DogSize;

export type DogSize = (typeof DogSize)[keyof typeof DogSize];

export const DonationCampaignState = {
    CREATED: 'CREATED',
    ACTIVE: 'ACTIVE',
    PAUSED: 'PAUSED',
    ENDED: 'ENDED'
} satisfies typeof prismaClient.DonationCampaignState;

export type DonationCampaignState =
    (typeof DonationCampaignState)[keyof typeof DonationCampaignState];

export const DonationReason = {
    FREE: 'FREE',
    CAMPAIGN: 'CAMPAIGN'
} satisfies typeof prismaClient.DonationReason;

export type DonationReason = (typeof DonationReason)[keyof typeof DonationReason];

export const PostState = {
    RESOLVED: 'RESOLVED',
    WAITING: 'WAITING'
} satisfies typeof prismaClient.PostState;

export type PostState = (typeof PostState)[keyof typeof PostState];

export const Role = {
    CLIENT: 'CLIENT',
    VET: 'VET',
    ADMIN: 'ADMIN'
} satisfies typeof prismaClient.Role;

export type Role = (typeof Role)[keyof typeof Role];

export const TracingType = {
    OWNER: 'OWNER',
    DOG: 'DOG'
} satisfies typeof prismaClient.TracingType;

export type TracingType = (typeof TracingType)[keyof typeof TracingType];
