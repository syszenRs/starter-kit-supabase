<script lang="ts">
	import type { defaultOptsDto } from '$lib/dto/flash-message';

	let { prop }: { prop: defaultOptsDto } = $props();

	function handle() {
		if (!prop.action) return;

		prop.action.onClick();
	}
</script>

<div class="ml-1 text-sm">
	<p class="bold">{prop.title}</p>
	<div class="font-normal flex flex-row w-full items-center">
		<div class="flex-1">{@html prop.description}</div>
		{#if prop.action}
			<button class="btn btn-xs bg-gray-700 text-neutral-100 {prop.action.class}" onclick={handle}>
				{prop.action.label}
			</button>
		{/if}
	</div>
</div>
