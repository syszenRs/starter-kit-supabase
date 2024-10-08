import type { FlashMessagePropsDto } from '$dto/flash-message';
import { flashMessageQueue } from '$store/flash-message.svelte';

type hookFormDataFlashMessageDto = {
	form?: {
		flashMessage?: FlashMessagePropsDto;
	};
};

//change data to {form}
export function useListenToFormFlashMessageHook(propsFormData: hookFormDataFlashMessageDto) {
	return () => {
		if (!propsFormData.form?.flashMessage) return;
		flashMessageQueue.add(propsFormData.form.flashMessage.type, propsFormData.form.flashMessage);
		// Clear the error after handling it
		propsFormData.form.flashMessage = undefined;
	};
}
