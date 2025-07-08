import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

// Strong password validation function
const strongPasswordSchema = z.string()
  .min(8, { message: 'Password must be at least 8 characters long.' })
  .regex(/\d/, { message: 'Password must contain at least one number.' })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one symbol (!@#$%^&*(),.?":{}|<>).' });

export const RegisterSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(8, {message: 'Please confirm your password.'}),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Path of error
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ResetPasswordFormSchema = z.object({
  password: strongPasswordSchema,
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export type ResetPasswordFormInputs = z.infer<typeof ResetPasswordFormSchema>; 