<script>
	let { children } = $props();
</script>

{#if children}<span class="text-sm text-red-500">{@render children()}</span>{/if}
