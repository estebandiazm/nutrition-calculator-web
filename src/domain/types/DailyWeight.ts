import { z } from "zod";

export const DailyWeightSchema = z.object({
  date: z.date(),
  weight: z
    .number()
    .min(0.1, { message: "Weight must be at least 0.1 kg" })
    .max(500, { message: "Weight must not exceed 500 kg" }),
  notes: z.string().optional(),
}).refine((data) => data.date <= new Date(), {
  message: "Date cannot be in the future",
  path: ["date"]
});

export type DailyWeight = z.infer<typeof DailyWeightSchema>;
