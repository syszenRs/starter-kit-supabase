<script lang="ts">
	import Todos from './todos.svelte';

	let { data } = $props();
</script>

<p class="text-center pt-10 text-xl">Hey <b>{data.user?.email}</b>, you reached the dashboard!</p>

<div class="flex justify-center gap-2 mt-10">
	<Todos todos={data.todos} />
</div>
