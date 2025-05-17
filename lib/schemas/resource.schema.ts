import * as z from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").max(100, "Title must be at most 100 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long").max(5000, "Description must be at most 5000 characters long"),
  tags: z.array(z.string().min(1, "Tag cannot be empty").max(50, "Tag must be at most 50 characters long")).min(1, "At least one tag is required").max(10, "Maximum of 10 tags allowed"),
  mediaUrls: z.array(z.string().url("Invalid URL format")).optional(),
  externalLink: z.string().url("Invalid URL format").optional().or(z.literal('')), // Allow empty string or valid URL
  creationInstructions: z.string().max(5000, "Creation instructions must be at most 5000 characters long").optional(),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>; 