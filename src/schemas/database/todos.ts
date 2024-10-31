import { relations, sql, type InferInsertModel } from 'drizzle-orm';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './auth';

export const todoTable = pgTable('todo', {
	id: uuid()
		.primaryKey()
		.default(sql`gen_random_uuid()`),
	userId: uuid()
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	name: varchar({ length: 100 }).notNull()
});

export const todoUserRelations = relations(usersTable, ({ many }) => ({
	todos: many(todoTable)
}));

export type Todo = InferInsertModel<typeof todoTable>;
