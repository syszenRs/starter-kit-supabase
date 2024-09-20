<script lang="ts">
	import { Toaster } from 'svelte-sonner';
	import { MessageQueue } from '$store/flash-message.svelte';

	const messages = MessageQueue.getMessageQueue();

	$effect(() => {
		messages.forEach((message) => {
			MessageQueue.display(message);
		});
	});
</script>

<Toaster
	richColors
	position="top-right"
	duration={500000}
	toastOptions={{
		class: 'flash-message'
	}}
/>
