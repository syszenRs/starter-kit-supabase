<script lang="ts">
	import { onMount } from 'svelte';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { emailCodeSchema } from '$schema/auth';

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
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Code</span>
		</div>
		<input type="number" name="code" bind:value={$form.code} placeholder="Type here" class="input input-bordered w-full input-md" />
		{#if $errors.code}<span class="label-text-alt text-red-500">{$errors.code}</span>{/if}
	</label>
	<button class="btn btn-primary btn-sm mt-8">Confirm</button>
</form>
<form method="POST" action="?/resendCode" use:resendEnhance>
	<button type="submit" class="btn btn-link btn-sm mt-8">Resend code</button>
</form>
