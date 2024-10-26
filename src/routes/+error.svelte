<script lang="ts">
	import { page } from '$app/stores';
	import { APP_REDIRECT } from '$constant/routes-url';
</script>

<div class="p-4 flex justify-center">
	<div class="w-fit">
		<p class="text-9xl">{$page.status}</p>
		<p class="text-3xl">Something went <b>wrong!</b></p>
		<p class="mt-5">{@html $page.error?.message}</p>
		<div class="mt-6">
			{#if $page.data.user}
				<a href={APP_REDIRECT.DASHBOARD}>Return to dashboard</a>
			{:else}
				<a href={APP_REDIRECT.ENTRY_POINT}>Return to home</a>
			{/if}
		</div>
	</div>
</div>
