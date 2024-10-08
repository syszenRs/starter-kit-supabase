<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { flashMessageQueue } from '$store/flash-message.svelte';

	$effect(() => {
		if (flashMessageQueue.queueCounter === 0) return;

		flashMessageQueue.displayNextOnQueue();
	});
</script>

<Toaster
	richColors
	position="top-right"
	toastOptions={{
		class: 'flash-message'
	}}
/>
