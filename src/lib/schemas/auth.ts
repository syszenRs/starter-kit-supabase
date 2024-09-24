import { z } from 'zod';

function checkPasswordComplexity(password: string): boolean {
	const pattern =
		/^(?=.*(?<Numbers>[0-9]))(?=.*(?<Alpha>[a-zA-Z]))(?=.*(?<Special>[^a-zA-Z0-9])).+$/;

	const result = pattern.test(password);

	return result;
}

export const authGenericSchema = z.object({
	email: z.string().email({ message: 'Please insert valid email.' }).trim(),
	password: z
		.string()
		.max(20, { message: 'Password should have at max 20 characters' })
		.min(6, { message: 'Password should have at least 6 characters' })
});

export const signupSchema = authGenericSchema.superRefine((arg, ctx) => {
	if (arg.password.length < 6) return;
	if (!checkPasswordComplexity(arg.password)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message:
				'Password must include at least one uppercase letter, one lowercase letter, and one special character',
			path: ['password']
		});
	}
});

export const confirmEmailSchema = z.object({
	email: z.string().email().trim(),
	code: z.string().length(6)
});

/* 	const customErrorMap = (issue, ctx) => {
	if (issue.code === z.ZodIssueCode.invalid_type) {
		return { message: 'is a required field' };
	}

	return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap); */
