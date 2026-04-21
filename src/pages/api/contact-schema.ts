import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  message: z.string().min(1, 'Message is required').max(5000),
  turnstileToken: z.string().min(1, 'Turnstile token required'),
});

export type ContactPayload = z.infer<typeof contactSchema>;
