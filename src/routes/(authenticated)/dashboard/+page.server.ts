import { TodoService } from '$service/TodoService';
import type { Actions, PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { response } = await TodoService.getAllByUser(locals.user!.id);

	return {
		todos: response,
		user: locals.user
	};
};

export const actions: Actions = {
	saveTodo: async (event: RequestEvent) => {
		console.log('saving todooo!');
	}
};
