import type { ActionResult } from '@sveltejs/kit';

export type EnhanceArgsDto = {
	formElement: HTMLFormElement;
	formData: FormData;
	action: string;
	cancel: () => void;
	submitter: HTMLElement;
};

export type EnhanceResultDto = {
	result: ActionResult;
	update: () => Promise<void>;
};
