import z, { string, ZodObject } from "zod";

export const inquiryValidationSchema = z.object({
    
    type: z
    .string(),

    name: z
    .string()
    .min(2, "Title should be at least 2 characters")
    .max(50, "Title should be at most 50 characters"),

    subject: z
    .string()
    .min(2, "Title should be at least 2 characters")
    .max(50, "Title should be at most 50 characters"),

    description: z
    .string()
    .min(2, "Description should be at least 2 characters")
    .max(200, "Description should be at most 200 characters"),
    
    email: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email format"),

    phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

    course: z
    .string()
    .min(2, "course should be at least 2 characters")
    .max(20, "course should be at most 20 characters"),

})