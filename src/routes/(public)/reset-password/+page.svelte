<script lang="ts">
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { resetEmailSchema } from '$schema/auth';
	import { zod } from 'sveltekit-superforms/adapters';
	import { page } from '$app/stores';

	const { form, errors, enhance } = superForm(defaultValues(zod(resetEmailSchema)), {
		onSubmit: ({ formData }) => {
			const token = $page.url.searchParams.get('token') as string;
			formData.append('token', token);
		}
	});
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Password</span>
		</div>
		<input type="password" name="password" bind:value={$form.password} placeholder="Type here" class="input input-bordered w-full input-md" />
		{#if $errors.password}<span class="label-text-alt text-red-500">{$errors.password}</span>{/if}
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Confirm password</span>
		</div>
		<input
			type="password"
			name="confirmPassword"
			bind:value={$form.confirmPassword}
			placeholder="Type here"
			class="input input-bordered w-full input-md"
		/>
		{#if $errors.confirmPassword}<span class="label-text-alt text-red-500">{$errors.confirmPassword}</span>{/if}
	</label>
	<button class="btn btn-primary btn-sm mt-8">Change password</button>
</form>
