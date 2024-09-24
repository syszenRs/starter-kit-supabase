<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="p-4 flex justify-center">
	<div class="w-fit">
		<p class="text-9xl">{$page.status}</p>
		<p class="text-3xl">Something went <b>wrong!</b></p>
		<p class="mt-5">{@html $page.error?.message}</p>
		<div class="mt-6">
			{#if $page.data.user}
				<a href="/dashboard" class="btn btn-primary">Return to dashboard</a>
			{:else}
				<a href="/" class="btn btn-primary">Return to home</a>
			{/if}
		</div>
	</div>
</div>
