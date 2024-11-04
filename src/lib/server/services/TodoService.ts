import { TodoController } from '$controller/TodoController';
import type { RequestEvent } from '@sveltejs/kit';
import type { Todo } from '$schemaDB/todos';
import { superValidate } from 'sveltekit-superforms';
import { todoSchema } from '$schemaValidate/todo';
import { zod } from 'sveltekit-superforms/adapters';
import type { ServiceOutputResultDto } from '$serverDto/service';
import { getDefaultServiceResultOutput } from '../utils';
import type { TodoDto } from '$serverDto/todo';

export class TodoService {
	public static async getAllByUser(userId: string): ServiceOutputResultDto<{ todos: TodoDto[] }> {
		const output = getDefaultServiceResultOutput<{ todos: TodoDto[] }>({ todos: [] });

		if (!userId || userId.length === 0) {
			output.error = { errorMessage: "User wasn't provided" };

			return output;
		}

		const { response } = await TodoController.GetAllByUserId(userId);
		output.result.todos = response;

		return output;
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
