import type { Cookies } from '@sveltejs/kit';

export const cookieUtils = {
	getAndDestroy(cookies: Cookies, identifier: string): string | undefined {
		const data = cookies.get(identifier);

		if (data) cookies.delete(identifier, { path: '/' });

		return data;
	},
	setCookie(cookies: Cookies, identifier: string, data: string) {
		//TODO:SET ALL COOKIES SECURE!!
		cookies.set(identifier, data, {
			secure: false,
			maxAge: 60 * 60 * 1, //1h
			priority: 'low',
			sameSite: 'strict',
			path: '/'
		});
	}
};
