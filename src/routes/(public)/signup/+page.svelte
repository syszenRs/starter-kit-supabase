<script lang="ts">
	import InputError from './../../../lib/components/temp/input-error.svelte';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import SampleUsers from '$components/temp/sample-users.svelte';
	import { authBaseSchema } from '$schema/auth';
	import { zod } from 'sveltekit-superforms/adapters';
	import Button from '$components/temp/button.svelte';

	const { form, errors, enhance } = superForm(defaultValues(zod(authBaseSchema)));
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label for="email">Email</label>
	<input type="email" id="email" name="email" bind:value={$form.email} placeholder="Type here" />
	<InputError>{$errors.email}</InputError>

	<label for="password">Password</label>
	<input type="password" id="password" name="password" bind:value={$form.password} placeholder="Type here" />
	<InputError>{$errors.password}</InputError>

	<Button>Register</Button>
</form>

<SampleUsers {form} />
