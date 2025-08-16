import z, { string, ZodObject } from "zod";

export const noticeValidationSchema = z.object({
    notice_id: z.string().optional(),

    title: z
    .string()
    .min(2, "Title should be at least 2 characters")
    .max(50, "Title should be at most 50 characters"),

    description: z
    .string()
    .min(2, "Description should be at least 2 characters")
    .max(200, "Description should be at most 200 characters"),

    year: z.coerce.number({ message: "year must be a valid" }),

    posted_by: z
    .string()
    .min(2, "It should be at least 2 characters")
    .max(20, "It should be at most 20 characters"),

})