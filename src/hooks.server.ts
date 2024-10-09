import { createServerClient } from '@supabase/ssr';
import { type Handle, type HandleServerError, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { CLIENT_ERROR_CODE, REDIRECT_CODE } from '$constant/http-code';
import { APP_REDIRECT } from '$constant/app-redirect-url';
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
	// so extract this logic to run this in layout aswell for server pages that don't need server
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	const isAccessingAuthenticatedPages = event.route.id?.includes('(authenticated)');

	if (!session && isAccessingAuthenticatedPages) {
		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.SIGNIN);
	}

	if (session && !isAccessingAuthenticatedPages) {
		throw redirect(REDIRECT_CODE.TEMPORARY_REDIRECT, APP_REDIRECT.DASHBOARD);
	}

	return resolve(event);
};

export const handleError: HandleServerError = async ({ status, message }) => {
	//TODO: Add custom error loggin here if needed like sentry or others

	if (status === CLIENT_ERROR_CODE.NOT_FOUND) {
		message = `Its seems that you know more than us trying to acessing something that doesn't exists`;
	} else {
		message = 'Its seems that something bad happen here...';
	}

	return {
		message: message
	};
};

export const handle: Handle = sequence(supabase, authGuard);
