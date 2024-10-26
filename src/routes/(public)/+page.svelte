<script lang="ts">
	let { data } = $props();
	let { session, user } = $derived(data);
</script>

<div class="py-10">
	<p class="text-3xl font-bold text-center">Welcome to the starter kit</p>
	<p class="text-sm text-center">built with SvelteKit + zod/superforms + Tailwind + Supabase</p>
</div>

<div class="grid grid-cols-2 gap-20">
	<div class="bg-slate-400 p-4 break-words">
		<p>Session:</p>
		<pre class="text-wrap">{JSON.stringify(session, null, 2)}</pre>
	</div>
	<div class="bg-slate-500 p-4 break-words">
		<p>User:</p>
		<pre class="text-wrap">{JSON.stringify(user, null, 2)}</pre>
	</div>
</div>
