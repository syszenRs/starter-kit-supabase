<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { emailCodeSchema } from '$schemaValidate/auth';
	import Button from '$components/temp/button.svelte';
	import InputError from '$components/temp/input-error.svelte';

	let { data } = $props();

	const { form, errors, enhance } = superForm(defaultValues(zod(emailCodeSchema)), {
		onSubmit: ({ formData }) => {
			formData.append('email', $form.email);
		}
	});

	const { enhance: resendEnhance } = superForm(defaultValues(zod(emailCodeSchema)), {
		invalidateAll: false,
		onSubmit: ({ formData }) => {
			formData.append('email', $form.email);
		}
	});

	onMount(() => {
		$form.email = data.email!;
	});
</script>

<div class="mb-4">
	<p class="text-xl font-bold">Email confirmation</p>
</div>

<form method="POST" action="?/confirmCode" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label for="code">Code</label>
	<input type="number" id="code" name="code" bind:value={$form.code} placeholder="Type here" />
	<InputError>{$errors.code}</InputError>

	<Button>Confirm</Button>
</form>
<form method="POST" action="?/resendCode" use:resendEnhance>
	<Button type="submit">Resend code</Button>
</form>
