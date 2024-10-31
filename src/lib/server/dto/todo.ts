export type TodoDto = {
	id: string;
	userId: string;
	name: string;
};

export type NewTodoDto = {
	userId?: string;
	name: string;
};
