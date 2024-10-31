<script>
	import { invalidateAll } from '$app/navigation';
	import Button from '$components/temp/button.svelte';

	let { todos = $bindable() } = $props();

	async function updateTodo(todo) {
		await fetch('?/saveTodo', {
			method: 'POST',
			body: JSON.stringify(todo)
		});
		invalidateAll();
	}
</script>

{#snippet todoItem(todo)}
	<div class="w-full max-w-md flex flex-row justify-between bg-neutral-300 p-2">
		<input type="text" class="border-none bg-neutral-200 px-2 rounded-md" value={todo.name} onblur={() => updateTodo(todo)} />
		<Button>delete</Button>
	</div>
{/snippet}

{#each todos as todo}
	{@render todoItem(todo)}
{/each}
