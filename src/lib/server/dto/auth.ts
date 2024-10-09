import { z } from 'zod';
import { authBaseSchema, emailCodeSchema, emailSchema, resetEmailSchema } from '$schema/auth';
import type { AuthSPResponseDto, BaseResponseDto } from './base';

export type AuthResponseDto = BaseResponseDto<z.infer<typeof authBaseSchema>> & {
	response?: AuthSPResponseDto;
};

export type ConfirmEmailResponseDto = BaseResponseDto<z.infer<typeof emailCodeSchema>> & {
	response?: AuthSPResponseDto;
};

export type ResetEmailResponseDto = BaseResponseDto<z.infer<typeof emailSchema>>;

export type resetPassword = BaseResponseDto<z.infer<typeof resetEmailSchema>>;
