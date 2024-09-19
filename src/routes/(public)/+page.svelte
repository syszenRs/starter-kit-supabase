<script>
	let { data } = $props();
	let { session, user } = $derived(data);
</script>

<p class="text-3xl font-bold text-center py-10">
	Welcome to SvelteKit + Tailwind/DaisyUI + Supabase
</p>

<div class="grid grid-cols-2 gap-20">
	<div class="bg-slate-400 p-4 break-words">
		<p>Session:</p>
		<code>{JSON.stringify(session)}</code>
	</div>
	<div class="bg-slate-500 p-4 break-words">
		<p>User:</p>
		<code>{JSON.stringify(user)}</code>
	</div>
</div>
