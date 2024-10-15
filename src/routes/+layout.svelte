<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { FlashMessage } from '$lib/components/flash-message';
	import { useListenToFlashMessageHook } from '$lib/utils/hooks';
	import { APP_REDIRECT } from '$constant/app-redirect-url';

	let data = $props();
	let { session, database } = $derived<App.Locals>(data.data);

	onMount(() => {
		const { data } = database.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	$effect(useListenToFlashMessageHook(data));
</script>

<FlashMessage />

<div class="flex justify-center py-6">
	<a href={APP_REDIRECT.ENTRY_POINT} class="btn btn-link">Home</a>
	{#if session}
		<form method="POST" use:enhance action="/signout">
			<button type="submit" class="btn btn-link">logout</button>
		</form>
	{:else}
		<a href={APP_REDIRECT.SIGNUP} class="btn btn-link">Sign up</a>
		<a href={APP_REDIRECT.SIGNIN} class="btn btn-link">Sign in</a>
	{/if}
	<a href={APP_REDIRECT.DASHBOARD} class="btn btn-link">Dashboard</a>
</div>

{@render data.children()}
