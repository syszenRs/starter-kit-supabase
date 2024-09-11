<script lang="ts">
	import { enhance } from '$app/forms';
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	export let data;
	$: ({ session, supabase } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="flex justify-center py-6">
	<a href="/" class="btn btn-link">Home</a>
	{#if session}
		<form method="POST" use:enhance action="/signout">
			<button type="submit" class="btn btn-link">logout</button>
		</form>
	{:else}
		<a href="/signup" class="btn btn-link">Sign up</a>
		<a href="/signin" class="btn btn-link">Sign in</a>
	{/if}
	<a href="/dashboard" class="btn btn-link">Dashboard</a>
</div>

<slot />
