<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { FlashMessage } from '$components/flash-message';
	import { useListenToFlashMessageHook } from '$lib/utils/hooks';
	import { APP_REDIRECT } from '$constant/routes-url';
	import Button from '$components/temp/button.svelte';

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

{#snippet clickable(url: string, text: string)}
	<a href={url} class="bg-orange-200 font-semibold text-sm px-2 py-1 rounded-md">{text}</a>
{/snippet}

<FlashMessage />

<div class="flex justify-center py-6 gap-4 bg-gray-300 px-1 md:px-10">
	{@render clickable(APP_REDIRECT.ENTRY_POINT, 'Home')}
	{#if session}
		<form method="POST" use:enhance action="/signout">
			<Button type="submit">logout</Button>
		</form>
	{:else}
		{@render clickable(APP_REDIRECT.SIGNUP, 'Sign up')}
		{@render clickable(APP_REDIRECT.SIGNIN, 'Sign in')}
	{/if}
	{@render clickable(APP_REDIRECT.DASHBOARD, 'Dashboard')}
</div>

<div class="mx-1 md:mx-10 mt-6">
	{@render data.children()}
</div>
