import { z } from 'zod';

const SignupSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(['USER', 'SERVICE_PROVIDER']),
});

const LoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const CreateServiceSchema = z.object({
  name: z.string(),
  type: z.enum(['MEDICAL', 'HOUSE_HELP', 'BEAUTY', 'FITNESS', 'EDUCATION', 'OTHER']),
  durationMinutes: z.number()
});

const timeRegex = /^([0-1][0-9]|2[0-3]):(00|30)$/;

const SetAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM) or minutes must be 00 or 30"),
  endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM) or minutes must be 00 or 30")
}).refine(data => data.startTime < data.endTime, {
  message: "startTime must be before endTime",
  path: ["startTime"]
});

const QueryServicesSchema = z.object({
  type: z.enum(['MEDICAL', 'HOUSE_HELP', 'BEAUTY', 'FITNESS', 'EDUCATION', 'OTHER']).optional()
});

const GetSlotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
});

const BookAppointmentSchema = z.object({
  slotId: z.string().min(1)
});

export const schemas = {
  SignupSchema,
  LoginSchema,
  CreateServiceSchema,
  SetAvailabilitySchema,
  QueryServicesSchema,
  GetSlotsSchema,
  BookAppointmentSchema
};