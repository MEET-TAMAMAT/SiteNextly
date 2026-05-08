import { z } from 'zod';

// Website validation - transformation handled at form submission
const websiteSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true; // Optional field

      // Updated pattern to support subdomains (subdomain.domain.com, www.domain.com, etc.)
      const websitePattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
      return websitePattern.test(val);
    },
    {
      message: 'Please enter a valid website (e.g., example.com, subdomain.example.com)',
    }
  );

// Base contact form schema
const baseContactSchema = z.object({
  // Contact Name: 2-100 characters, letters/spaces/hyphens/apostrophes/periods only
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'),

  // Email: Valid format, max 100 characters (as requested)
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email is too short')
    .max(100, 'Email must be less than 100 characters'),

  // Phone: International format with optional + at start
  phone: z
    .string()
    .min(7, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number (e.g., +1 555-123-4567)'),

  // Lead type selection
  leadType: z.enum(['person', 'company']),

  // Company name (conditionally required)
  company: z
    .string()
    .max(100, 'Company name is too long')
    .optional(),

  // Website with auto-https transformation
  website: websiteSchema,

  // Message: 10-2000 characters
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),

  // Optional fields
  country: z.string().optional(),
  messengerType: z.string().optional(),
  messengerHandle: z
    .string()
    .min(3, 'Messenger handle must be at least 3 characters')
    .max(50, 'Messenger handle is too long')
    .regex(
      /^[\+@]?[a-zA-Z0-9._\-\s\(\)]+[@.\s]?[a-zA-Z0-9._\-\s\(\)]*$/,
      'Please enter a valid messenger handle (phone number, @username, or user ID)'
    )
    .optional()
    .or(z.literal('')),
});

// Contact form schema with conditional validation
export const contactFormSchema = baseContactSchema
  .refine(
    (data) => {
      // Company is required when leadType is 'company'
      if (data.leadType === 'company') {
        return data.company && data.company.trim().length >= 2;
      }
      return true;
    },
    {
      message: 'Company name is required for schools',
      path: ['company'],
    }
  )
  .refine(
    (data) => {
      // Messenger handle validation only when messenger type is selected
      if (data.messengerType && data.messengerType !== '') {
        return data.messengerHandle && data.messengerHandle.trim().length >= 3;
      }
      return true;
    },
    {
      message: 'Messenger handle is required when messenger type is selected',
      path: ['messengerHandle'],
    }
  );

// Export the inferred type for TypeScript
export type ContactFormData = z.infer<typeof contactFormSchema>;

// Helper function for server-side validation
export const validateContactForm = (data: unknown) => {
  return contactFormSchema.safeParse(data);
};

// UTM parameters schema (for API)
export const utmParamsSchema = z.object({
  utm_source: z.string().default('direct'),
  utm_medium: z.string().default('none'),
  utm_campaign: z.string().default('none'),
  utm_content: z.string().default('none'),
  utm_term: z.string().default('none'),
});

// Complete API payload schema
export const contactApiSchema = contactFormSchema.extend({
  utm_source: z.string().default('direct'),
  utm_medium: z.string().default('none'),
  utm_campaign: z.string().default('none'),
  utm_content: z.string().default('none'),
  utm_term: z.string().default('none'),
  // Cloudflare Turnstile token
  'cf-turnstile-response': z.string().min(1, 'CAPTCHA verification required'),
});
export type ContactApiData = z.infer<typeof contactApiSchema>;