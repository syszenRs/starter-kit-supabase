import type { FlashMessagePropsDto } from '$dto/flash-message';
import { flashMessageQueue } from '$store/flash-message.svelte';

type hookFormDataFlashMessageDto = {
	data: App.Locals;
	form?: {
		flashMessage?: FlashMessagePropsDto;
	};
};

//change data to {form}
export function useListenToFlashMessageHook(propsFormData: hookFormDataFlashMessageDto) {
	function handleMessage(flashMessage: FlashMessagePropsDto) {
		flashMessageQueue.add(flashMessage.type, flashMessage);
	}

	return () => {
		if (propsFormData.form?.flashMessage) {
			handleMessage(propsFormData.form.flashMessage);
			propsFormData.form.flashMessage = undefined;
		}
		if (propsFormData.data.serverFlashMessage) {
			handleMessage(propsFormData.data.serverFlashMessage);
			propsFormData.data.serverFlashMessage = null;
		}
	};
}
