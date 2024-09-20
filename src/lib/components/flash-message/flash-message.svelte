<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { MessageQueue } from '$store/flash-message.svelte';

	const messages = MessageQueue.getMessageQueue();

	//TODO: can't close toast inside the custom component

	$effect(() => {
		messages.forEach((message) => {
			MessageQueue.display(message);
		});
	});
</script>

<Toaster
	richColors
	position="top-right"
	toastOptions={{
		class: 'flash-message'
	}}
/>
