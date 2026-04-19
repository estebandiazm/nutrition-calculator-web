import { z } from "zod";

export const DailyStepSchema = z.object({
  date: z.date().max(new Date(), { message: "Date cannot be in the future" }),
  steps: z.number().int().min(0, { message: "Steps must be 0 or greater" }).max(100000, { message: "Steps cannot exceed 100,000" }),
  notes: z.string().optional(),
});

export type DailyStep = z.infer<typeof DailyStepSchema>;
