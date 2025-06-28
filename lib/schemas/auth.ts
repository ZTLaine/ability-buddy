import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  confirmPassword: z.string().min(8, {message: 'Please confirm your password.'}),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Path of error
});

export type RegisterFormData = z.infer<typeof RegisterSchema>; 