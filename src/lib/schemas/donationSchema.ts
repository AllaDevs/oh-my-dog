import { z } from 'zod';
import { c } from './commonSchema';


export const donationCampaignBase = z.object({
    name: z.string().max(80),
    description: z.string().refine(d => d.split(/\s+/).length <= 200),
    banner: c.imageSchema
});


export const donationCampaignRegisterSchema = donationCampaignBase;
export type DonationCampaignRegisterSchema = typeof donationCampaignRegisterSchema;

export const donationCampaignUpdateSchema = donationCampaignBase.extend({
    banner: c.imageSchema.optional()
});


const donationFormBaseSchema = z.object({
    amount: z.number().int().min(100),
});

export let generalDonationSchema = donationFormBaseSchema;
export type GeneralDonationSchema = typeof generalDonationSchema;

export let campaignDonationSchema = donationFormBaseSchema;
export type CampaignDonationSchema = typeof campaignDonationSchema;
