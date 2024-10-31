import { TodoController } from '$controller/TodoController';
import type { RequestEvent } from '@sveltejs/kit';
import type { Todo } from '$schemaDB/todos';
import { superValidate } from 'sveltekit-superforms';
import { todoSchema } from '$schemaValidate/todo';
import { zod } from 'sveltekit-superforms/adapters';

export class TodoService {
	public static async getAllByUser(userId: string) {
		if (!userId || userId.length === 0) {
			return "User wasn't provided";
		}

		return await TodoController.GetAllByUserId(userId);
	}

	public static async createOrUpdate(todo: Todo, { request, locals }: RequestEvent) {
		const form = await superValidate(request, zod(todoSchema));

		if (!form.valid) {
			return 'ERROR';
		}

		if (form.id) {
			const userTodo = await TodoController.getById(form.id);
			if (userTodo.response![0].userId !== locals.user?.id) {
				return 'WTF';
			}
		} else {
			todo.userId = locals.user!.id;
		}

		return await TodoController.save(todo);
	}

	public static async deleteById(todoId: string) {
		if (!todoId || todoId.length === 0) {
			return "Todo wasn't provided";
		}

		return await TodoController.delete(todoId);
	}
}
