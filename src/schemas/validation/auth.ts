import { z } from 'zod';

function checkPasswordComplexity(password: string): boolean {
	const pattern = /^(?=.*(?<Numbers>[0-9]))(?=.*(?<Alpha>[a-zA-Z]))(?=.*(?<Special>[^a-zA-Z0-9])).+$/;

	const result = pattern.test(password);

	return result;
}

const BASE_EMAIL_SCHEMA = z.string().email({ message: 'Please insert valid email.' }).trim();

export const authBaseSchema = z.object({
	email: BASE_EMAIL_SCHEMA,
	password: z
		.string()
		.max(20, { message: 'Password should have at max 20 characters' })
		.min(6, { message: 'Password should have at least 6 characters' })
});

export const signupSchema = authBaseSchema.superRefine((arg, ctx) => {
	if (arg.password.length < 6 || arg.password.length > 20) return;
	if (!checkPasswordComplexity(arg.password)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Password must include at least one uppercase letter, one lowercase letter, and one special character',
			path: ['password']
		});
	}
});

export const emailCodeSchema = z.object({
	email: BASE_EMAIL_SCHEMA,
	code: z.string().length(6)
});

export const emailSchema = z.object({
	email: BASE_EMAIL_SCHEMA
});

export const resetEmailSchema = z
	.object({
		token: z.string().min(40, { message: 'token seems invalid' }),
		password: z
			.string()
			.max(20, { message: 'Password should have at max 20 characters' })
			.min(6, { message: 'Password should have at least 6 characters' }),
		confirmPassword: z
			.string()
			.max(20, { message: 'Password should have at max 20 characters' })
			.min(6, { message: 'Password should have at least 6 characters' })
	})
	.superRefine((arg, ctx) => {
		if (arg.password.length < 6 || arg.password.length > 20 || arg.confirmPassword.length < 6 || arg.confirmPassword.length > 20) return;

		let passwordComplexityError = false;
		if (!checkPasswordComplexity(arg.password)) {
			passwordComplexityError = true;
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password must include at least one uppercase letter, one lowercase letter, and one special character',
				path: ['password']
			});
		}
		if (!checkPasswordComplexity(arg.confirmPassword)) {
			passwordComplexityError = true;
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Confirm password must include at least one uppercase letter, one lowercase letter, and one special character',
				path: ['confirmPassword']
			});
		}

		if (!passwordComplexityError && arg.password !== arg.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Password must match',
				path: ['confirmPassword']
			});
		}
	});

export type authBaseSchemaDto = z.infer<typeof authBaseSchema>;

export type emailCodeSchemaDto = z.infer<typeof emailCodeSchema>;

export type emailSchemaDto = z.infer<typeof emailSchema>;

export type resetEmailSchemaDto = z.infer<typeof resetEmailSchema>;

/* 	const customErrorMap = (issue, ctx) => {
	if (issue.code === z.ZodIssueCode.invalid_type) {
		return { message: 'is a required field' };
	}

	return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap); */
