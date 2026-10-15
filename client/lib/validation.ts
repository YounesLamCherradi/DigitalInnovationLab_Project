import { z } from 'zod';

export const contactSchema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:   z.string().email('Invalid email address').max(254),
  phone:   z.string().max(30).optional(),
  subject: z.string().min(2, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const applicationSchema = z.object({
  fullName:    z.string().min(2, 'Full name is required').max(100),
  email:       z.string().email('Invalid email address').max(254),
  phone:       z.string().min(5, 'Phone is required').max(30),
  position:    z.string().min(1).max(200),
  coverLetter: z.string().min(20, 'Cover letter must be at least 20 characters').max(5000),
});

export type ContactFormData    = z.infer<typeof contactSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
