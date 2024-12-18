import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, serverFlashMessage }, cookies }) => {
	const { session } = await safeGetSession();

	console.log('layoutS::', serverFlashMessage);

	return {
		session,
		cookies: cookies.getAll(),
		serverFlashMessage
	};
};
