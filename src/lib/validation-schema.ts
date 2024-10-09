import { z } from "zod";

const requiredString = z.string().trim().min(1, " required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString,
  password: requiredString.min(8, "Must be atleast 8 characters"),
});

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString.min(8, "Must be atleast 8 characters"),
});

export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z
    .array(z.string())
    .max(5, "Cannot have more than 5 attachments at a time"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z
    .string()
    .max(1000, "The bio should not be more than 1000 characters")
    .optional(),
});

export const createCommentSchema = z.object({
  content: requiredString,
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
