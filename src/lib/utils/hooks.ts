import { MessageType } from '$dto/flash-message';
import { MessageQueue } from '$store/flash-message.svelte';

type hookFormErrorDto = {
	form?: {
		error: string;
	};
};

export function useFormErrorHook(data: hookFormErrorDto, title: string) {
	return () => {
		if (data.form?.error) {
			MessageQueue.add(MessageType.error, {
				title,
				description: data.form.error
			});

			// Clear the error after handling it
			data.form.error = '';
		}
	};
}
