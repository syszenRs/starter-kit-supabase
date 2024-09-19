import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: 'Please insert valid email.' }).trim().default(''),
	password: z.string().min(6, { message: 'Password should have at least 6 characters' }).default('')
});
