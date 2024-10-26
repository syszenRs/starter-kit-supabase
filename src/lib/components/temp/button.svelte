<script>
	let { children, ...others } = $props();
</script>

<button {...others} class="bg-neutral-500 font-semibold text-sm px-2 py-1 rounded-md">{@render children?.()}</button>
