export function handleTryCatchError(error: unknown): string {
	let errorMessage = 'An unknown error occurred';

	if (error instanceof Error) {
		errorMessage = error.message;
	}

	return errorMessage;
}
