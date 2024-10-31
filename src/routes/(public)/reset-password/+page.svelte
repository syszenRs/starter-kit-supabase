<script lang="ts">
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { resetEmailSchema } from '$schemaValidate/auth';
	import { zod } from 'sveltekit-superforms/adapters';
	import { page } from '$app/stores';
	import Button from '$components/temp/button.svelte';
	import InputError from '$components/temp/input-error.svelte';

	const { form, errors, enhance } = superForm(defaultValues(zod(resetEmailSchema)), {
		onSubmit: ({ formData }) => {
			const token = $page.url.searchParams.get('token') as string;
			formData.append('token', token);
		}
	});
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label for="password">Password</label>
	<input type="password" name="password" bind:value={$form.password} placeholder="Type here" />
	<InputError>{$errors.password}</InputError>

	<label for="confirmPassword">Confirm password</label>
	<input type="password" id="confirmPassword" name="confirmPassword" bind:value={$form.confirmPassword} placeholder="Type here" />
	<InputError>{$errors.confirmPassword}</InputError>

	<Button>Change password</Button>
</form>
