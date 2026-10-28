import { z } from "zod";
export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  practice: z.enum([
    "Independent bookkeeper",
    "Small bookkeeping practice",
    "Other",
  ]),
  format: z.enum(["Private training", "Team workshop", "Not sure yet"]),
  priorities: z.string().trim().min(5).max(1500),
  consent: z.literal(true),
  website: z.string().max(0),
  started: z.number().positive(),
  requestId: z.uuid(),
  referral: z.string().max(40),
});
export const deliverySchema = z.object({
  intent: z.literal("assessment"),
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  consent: z.literal(true),
  website: z.string().max(0),
  started: z.number().positive(),
  requestId: z.uuid(),
  referral: z.string().max(40),
});
export const assessmentSchema = z.object({
  answers: z.record(z.string().max(40), z.string().max(300)),
  requestId: z.uuid(),
  referral: z.string().max(40),
});
