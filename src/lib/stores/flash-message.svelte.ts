import { toast } from 'svelte-sonner';
import { MessageType, type defaultOptsDto, type FlashPromiseOptsDto } from '$lib/dto/flash-message';
import { FlashMessageRender } from '$lib/components/flash-message';

type FlashMessageDto = {
	id: number;
	type: MessageType;
	opts: defaultOptsDto | FlashPromiseOptsDto;
	promise?: Promise<unknown>;
};

class FlashMessage {
	private messagesQueue = $state<Array<FlashMessageDto>>([]);
	private currentId = 0;

	public constructor() {
		this.currentId = 0;
	}

	public getMessageQueue() {
		return this.messagesQueue;
	}

	public add(type: MessageType, opts: defaultOptsDto) {
		if (!opts.description || opts.description == '')
			throw new Error('No description provided for flash message');
		if (!(type in MessageType)) type = MessageType.info;

		this.currentId++;
		const messageToAdd: FlashMessageDto = {
			id: this.currentId,
			type,
			opts
		};

		this.messagesQueue.push(messageToAdd);
	}

	public addPromise(promise: Promise<unknown>, opts: FlashPromiseOptsDto) {
		if (!promise) throw new Error('No promise provided for promise flash message');

		this.currentId++;
		const messageToAdd: FlashMessageDto = {
			id: this.currentId,
			type: MessageType.promise,
			opts,
			promise
		};

		this.messagesQueue.push(messageToAdd);
	}

	public display(message: FlashMessageDto) {
		if (message.type == MessageType.promise) {
			this.displayPromise(message);
		} else {
			this.displayDefault(message);
		}
		this.delete(message.id);
	}

	private displayPromise(message: FlashMessageDto) {
		toast.promise(message.promise!, message.opts);
	}

	private displayDefault(message: FlashMessageDto) {
		const opts = message.opts as defaultOptsDto;
		toast[message.type](FlashMessageRender, {
			componentProps: {
				prop: opts
			}
		});
	}

	private delete(id: number) {
		const index = this.messagesQueue.findIndex((message) => message.id === id);
		if (index < 0) return;

		this.messagesQueue.splice(index, 1);
	}
}

export const MessageQueue = new FlashMessage();
