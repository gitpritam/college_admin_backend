import z from "zod";

export const createNotificationValidation = z.object({
  type: z.enum(["notice", "event", "announcement", "alert"]),

  title: z
    .string()
    .min(3, "Title should be at least 3 characters")
    .max(100, "Title should be at most 100 characters"),

  message: z
    .string()
    .min(3, "Message should be at least 3 characters")
    .max(500, "Message should be at most 500 characters"),

  priority: z.enum(["low", "medium", "high"]).optional(),

  metadata: z.any().optional(),
});
