// src/validations/faculty.validation.ts
import { z } from "zod";
import { addressValidationSchema } from "./address.validation";

export const studentValidationSchema = z.object({
    
  student_id: z.string().optional(),

  first_name: z
    .string()
    .min(2, "First name should be at least 2 characters")
    .max(20, "First name should be at most 20 characters"),

  middle_name: z
    .string()
    .max(20, "Middle name should be at most 20 characters")
    .optional(),

  last_name: z
    .string()
    .min(2, "Last name should be at least 2 characters")
    .max(20, "Last name should be at most 20 characters"),
    
  registration_no: z
    .string()
    .regex (/^[A-Z]{2}\d{4}$/, "Invalid registration number format"), 
    
   roll_no: z
    .number()
    .min(2, "Last name should be at least 2 characters")
    .max(60, "Last name should be at most 20 characters"),

  dob: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    "Dob must be in YYYY-MM-DD format"
  ),

  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

  email: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email format"),
    
  guardian_name: z
    .string()
    .min(2, "Guardian name should be at least 2 characters")
    .max(30, "Guardian name should be at most 30 characters"),

   guardian_phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

   guardian_email: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Invalid email format"),
    
    current_address: addressValidationSchema,
    permanent_address: addressValidationSchema,
    
    department: z
    .string()
    .min(2, "Department should be at least 2 characters")
    .max(5, "Department should be at most 5 characters"),

    year_of_admission: z.coerce.number({ message: "year of admission must be a valid" }),

    year_of_passout: z.coerce.number({ message: "year of paassing must be a valid" }),
    
    passport_photo_url: z.url("Invalid profile picture URL").optional(),
});
