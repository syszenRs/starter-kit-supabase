import { z } from 'zod';

export const todoSchema = z.object({
	id: z.string().nullish(),
	userId: z.string().nullish(),
	name: z.string().min(1).max(256)
});
