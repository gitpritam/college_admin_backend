// src/validations/faculty.validation.ts
import { z } from "zod";
import { addressValidationSchema } from "./address.validation";

export const facultyValidationSchema = z.object({
  faculty_id: z.string().optional(),

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

  dob: z.coerce.date({ message: "Date of birth must be a valid date" }),

  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),

  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    ),

  current_address: addressValidationSchema,
  permanent_address: addressValidationSchema,

  designation: z
    .string()
    .min(3, "Designation should be at least 3 characters")
    .max(200, "Designation should be at most 200 characters"),

  qualification: z
    .string()
    .min(3, "Qualification should be at least 3 characters")
    .max(200, "Qualification should be at most 200 characters"),

  experience: z
    .string()
    .min(3, "Experience should be at least 3 characters")
    .max(200, "Experience should be at most 200 characters"),

  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      "Password must contain at least one uppercase letter, one number, and one special character"
    )
    .optional(),
  role: z
    .string()
    .refine((val) => ["admin", "faculty", "staff", "guest"].includes(val), {
      message: "Invalid role",
    }),

  joining_date: z.coerce.date({ message: "Joining date must be a valid date" }),

  notice_permission: z.boolean().default(false),
  event_permission: z.boolean().default(false),

  department: z
    .string()
    .min(2, "Department should be at least 2 characters")
    .max(50, "Department should be at most 50 characters"),

  profile_picture_url: z.url("Invalid profile picture URL").optional(),
});
