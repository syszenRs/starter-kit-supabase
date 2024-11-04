import { todoTable, type Todo } from '$schemaDB/todos';
import { eq } from 'drizzle-orm';
import { database } from '../database';
import { handleTryCatchError } from '$lib/utils/error';

export class TodoController {
	public static async GetAllByUserId(userId: string) {
		try {
			const response = await database
				.select({
					id: todoTable.id,
					name: todoTable.name
				})
				.from(todoTable)
				.where(eq(todoTable.userId, userId));

			return {
				error: null,
				response
			};
		} catch (error) {
			return {
				response: [],
				error: handleTryCatchError(error)
			};
		}
	}

	public static async getById(todoId: string) {
		try {
			const response = await database
				.select({
					userId: todoTable.userId
				})
				.from(todoTable)
				.where(eq(todoTable.id, todoId))
				.limit(1);

			return {
				error: null,
				response
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async save(todo: Todo) {
		try {
			const response = await database
				.insert(todoTable)
				.values(todo)
				.onConflictDoUpdate({
					target: todoTable.id,
					set: { name: todo.name }
				});

			return {
				error: null,
				response
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}

	public static async delete(todoId: string) {
		try {
			const response = await database.delete(todoTable).where(eq(todoTable.id, todoId));

			return {
				error: null,
				response
			};
		} catch (error) {
			return {
				response: null,
				error: handleTryCatchError(error)
			};
		}
	}
}
