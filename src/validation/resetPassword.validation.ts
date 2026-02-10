import z from "zod";

export const resetPasswordValidationSchema = z.object({
  newPassword: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
      "Password must contain at least one uppercase letter, one number, and one special character",
    ),
  token: z.string().nonempty("Reset token is required"),
});
