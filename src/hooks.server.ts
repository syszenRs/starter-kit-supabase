import { type Handle, type HandleServerError, redirect } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { CLIENT_ERROR_CODE, REDIRECT_CODE } from '$constant/http-code';
import { APP_REDIRECT } from '$constant/routes-url';
import { cookieUtils } from '$lib/utils/cookies';
import { COOKIE } from '$constant/cookies';
import { dev } from '$app/environment';
import { MessageType } from '$dto/flash-message';

//TODO: if DB Service is down show a static page
const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.database = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	if ('suppressGetSessionWarning' in event.locals.database.auth) {
		// @ts-expect-error - suppressGetSessionWarning is not part of the official API
		event.locals.database.auth.suppressGetSessionWarning = true;
	} else {
		console.warn('SupabaseAuthClient#suppressGetSessionWarning was removed. See https://github.com/supabase/auth-js/issues/888.');
	}

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.database.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.database.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	//TODO: this only runs for server side pages (pages with server.ts file associated)
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	const isAccessingAuthenticatedPages = event.route.id?.includes('(authenticated)');

	if (!session && isAccessingAuthenticatedPages) {
		console.log('ath');
		cookieUtils.sentServerFlashMessage(event.cookies, COOKIE.SERVER_FLASH_MESSAGE, {
			title: 'Authentication',
			description: 'You need to sign-in first',
			type: MessageType.error
		});

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.SIGNIN);
	}

	if (session && !isAccessingAuthenticatedPages) {
		cookieUtils.sentServerFlashMessage(event.cookies, COOKIE.SERVER_FLASH_MESSAGE, {
			title: 'Authentication',
			description: 'You are already logged in',
			type: MessageType.error
		});

		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.DASHBOARD);
	}

	return resolve(event);
};

export const handleError: HandleServerError = async ({ error, status, message }) => {
	//TODO: Add custom error loggin here if needed like sentry or others

	let outputMessage = '';

	if (status === CLIENT_ERROR_CODE.NOT_FOUND) {
		outputMessage = `Its seems that you know more than us trying to acessing something that doesn't exists`;
	} else {
		outputMessage = 'Its seems that something bad happen here...';
	}

	if (dev) {
		outputMessage +=
			'<br><br><div style="background-grey; border: 2px solid red; padding: 10px"><b>DEV ERROR DEBUG</b><br>' +
			message +
			'' +
			'<br>' +
			error +
			'</div>';
	}

	return {
		message: outputMessage
	};
};

const t: Handle = async ({ event, resolve }) => {
	const flashMessage = cookieUtils.getAndDestroy(event.cookies, COOKIE.SERVER_FLASH_MESSAGE);
	event.locals.serverFlashMessage = flashMessage ? JSON.parse(flashMessage) : null;
	console.log('t', flashMessage, event.locals.serverFlashMessage);
	return resolve(event);
};

export const handle: Handle = sequence(supabase, authGuard, t);
