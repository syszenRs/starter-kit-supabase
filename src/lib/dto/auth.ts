import type { AuthTokenResponsePassword } from '@supabase/supabase-js';
import { type SuperValidated } from 'sveltekit-superforms';
import { z } from 'zod';
import { loginSchema } from '$schema/auth';

export type SigninResponseDto = {
	errorCode: number;
	form: SuperValidated<z.infer<typeof loginSchema>>;
	response?: AuthTokenResponsePassword;
};
