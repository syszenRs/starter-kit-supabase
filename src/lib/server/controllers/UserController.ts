import type { userDataDto } from '$serverDto/user';
import type { SupabaseClient } from '@supabase/supabase-js';
import { handleTryCatchError } from '../../utils/error';

export class UserController {
	public static async updateUser(DBClient: SupabaseClient, userData: userDataDto) {
		if (!userData.email && !userData.password)
			return {
				response: null,
				error: 'No email or password provided'
			};

		try {
			const response = await DBClient.auth.updateUser(userData);

			return {
				response,
				error: null
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}
}
