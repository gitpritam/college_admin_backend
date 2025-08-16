import z, { string, ZodObject } from "zod";

export const eventValidationSchema = z.object({
    event_id: z.string().optional(),

    title: z
    .string()
    .min(2, "Title should be at least 2 characters")
    .max(50, "Title should be at most 50 characters"),

    description: z
    .string()
    .min(2, "Description should be at least 2 characters")
    .max(200, "Description should be at most 200 characters"),

    start_date: z
    .date(),

    end_date: z
    .date(),

    start_time: z
    .string(),

    end_time: z
    .string(),

    venue: z
    .string()
    .min(2,"Venue should be at least 2 characters")
    .max(100,"Venue should be at most 200 characters"),

    posted_by: z
    .string()
    .min(2, "It should be at least 2 characters")
    .max(20, "Itshould be at most 20 characters"),

})