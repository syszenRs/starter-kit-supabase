<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { enhance as SKEnhance } from '$app/forms';
	import { defaultValues, superForm, superValidate } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { MessageType, type FlashMessagePropsDto } from '$dto/flash-message';
	import { emailCodeSchema, emailSchema } from '$schema/auth';
	import { flashMessageQueue } from '$store/flash-message.svelte';
	import { goto } from '$app/navigation';
	import { APP_REDIRECT } from '$constant/app-redirect-url.js';

	let { data } = $props();

	const { form, errors, enhance } = superForm(defaultValues(zod(emailCodeSchema)));

	onMount(() => {
		$form.email = data.email!;
	});

	const resendCodehook: SubmitFunction = async ({ formData, cancel }) => {
		formData.append('email', $form.email);
		const result = await superValidate(formData, zod(emailSchema));

		if (!result.valid) {
			cancel();
			flashMessageQueue.add(MessageType.error, {
				title: 'Resend confirmation code',
				description: 'It seems that we lost your email somehow..<br>Please try to sign in, so we can identify you'
			});
			return goto(APP_REDIRECT.SIGNIN);
		}

		return async ({ result }) => {
			//TODO: this fuking error is anoying

			if (result.type === 'success' && 'data' in result) {
				const messageData = result.data?.flashMessage as FlashMessagePropsDto;

				flashMessageQueue.add(messageData.type, {
					title: messageData.title,
					description: messageData.description
				});
			} else {
				flashMessageQueue.add(MessageType.error, {
					title: 'Resend code',
					description: 'Something happen on our side.<br>Please try again later, if the issue persist contact our support.'
				});
			}
		};
	};
</script>

<div class="mb-4">
	<p class="text-xl font-bold">Email confirmation</p>
</div>

<form method="POST" action="?/confirmCode" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<input type="hidden" name="email" bind:value={$form.email} placeholder="Type here" class="input input-bordered w-full input-md hidden" />
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Code</span>
		</div>
		<input type="number" name="code" bind:value={$form.code} placeholder="Type here" class="input input-bordered w-full input-md" />
		{#if $errors.code}<span class="label-text-alt text-red-500">{$errors.code}</span>{/if}
	</label>
	<button class="btn btn-primary btn-sm mt-8">Confirm</button>
</form>
<form method="POST" action="?/resendCode" use:SKEnhance={resendCodehook}>
	<button type="submit" class="btn btn-link btn-sm mt-8">Resend code</button>
</form>
