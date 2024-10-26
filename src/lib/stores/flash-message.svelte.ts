import { toast } from 'svelte-sonner';
import { MessageType, type DefaultOptsDto, type FlashPromiseOptsDto } from '$dto/flash-message';
import { FlashMessageCustomRender } from '$components/flash-message';

type FlashMessageDto = {
	type: MessageType;
	opts: DefaultOptsDto | FlashPromiseOptsDto;
	promise?: Promise<unknown>;
	displayFunction: (message: FlashMessageDto) => void;
};

class FlashMessageQueue {
	private _messagesQueue = $state<Array<FlashMessageDto>>([]);
	public queueCounter = $derived.by(() => this._messagesQueue.length);

	public add(type: MessageType, opts: DefaultOptsDto) {
		if (!opts.description || opts.description == '') throw new Error('No description provided for flash message');
		if (!(type in MessageType)) type = MessageType.info;

		const messageToAdd: FlashMessageDto = {
			type,
			opts,
			displayFunction: this._displayDefault
		};
		this._messagesQueue.push(messageToAdd);
	}

	public addPromise(promise: Promise<unknown>, opts: FlashPromiseOptsDto) {
		if (!promise) throw new Error('No promise provided for promise flash message');

		const messageToAdd: FlashMessageDto = {
			type: MessageType.promise,
			opts,
			promise,
			displayFunction: this._displayPromise
		};

		this._messagesQueue.push(messageToAdd);
	}

	public displayNextOnQueue() {
		const message = this._messagesQueue.shift();
		if (!message) return;

		message.displayFunction(message);
	}

	private _displayPromise(message: FlashMessageDto) {
		toast.promise(message.promise!, message.opts);
	}

	private _displayDefault(message: FlashMessageDto) {
		const opts = message.opts as DefaultOptsDto;
		toast[message.type](FlashMessageCustomRender, {
			componentProps: {
				prop: opts
			}
		});
	}
}

export const flashMessageQueue = new FlashMessageQueue();
