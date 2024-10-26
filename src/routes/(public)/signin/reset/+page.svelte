<script lang="ts">
	import Button from '$components/temp/button.svelte';
	import InputError from '$components/temp/input-error.svelte';
	import { emailSchema } from '$schema/auth';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	const { form, errors, enhance } = superForm(defaultValues(zod(emailSchema)));
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label for="email">Email</label>
	<input type="email" id="email" name="email" bind:value={$form.email} placeholder="Type here" />
	<InputError>{$errors.email}</InputError>

	<Button>Reset Password</Button>
</form>
