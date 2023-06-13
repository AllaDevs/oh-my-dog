import { z } from 'zod';
import { c } from './commonSchema';


export const donationCampaignBase = z.object({
    name: z.string().max(80),
    description: z.string().min(128).refine(d => d.split(/\s+/).length <= 200),
    banner: c.imageSchema
});


export const donationCampaignRegisterSchema = donationCampaignBase;
export type DonationCampaignRegisterSchema = typeof donationCampaignRegisterSchema;

export const donationCampaignUpdateSchema = donationCampaignBase.extend({
    banner: c.imageSchema.optional()
})
