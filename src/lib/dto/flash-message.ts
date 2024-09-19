export enum MessageType {
	message = 'message',
	success = 'success',
	info = 'info',
	warning = 'warning',
	error = 'error',
	promise = 'promise'
}

export type defaultOptsDto = {
	title?: string;
	description: string;
	action?: {
		label: string;
		class: string;
		onClick: () => void;
	};
};

export type FlashPromiseOptsDto = {
	loading: string;
	success: (data: unknown) => string;
	error: string;
};
