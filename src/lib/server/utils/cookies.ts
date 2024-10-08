import type { Cookies } from '@sveltejs/kit';

export const cookieUtils = {
	getAndDestroy(cookies: Cookies, identifier: string): string | undefined {
		const data = cookies.get(identifier);

		if (data) cookies.delete(identifier, { path: '/' });

		return data;
	}
};
