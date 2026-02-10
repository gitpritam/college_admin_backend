import z from "zod";

export const forgotPasswordValidationSchema = z.object({
  email: z.email("Invalid email address"),
});
