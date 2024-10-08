<script>
	import { emailSchema } from '$schema/auth';
	import { defaultValues, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	const { form, errors, enhance } = superForm(defaultValues(zod(emailSchema)));
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Email </span>
		</div>
		<input type="email" name="email" bind:value={$form.email} placeholder="Type here" class="input input-bordered w-full input-md" />
		{#if $errors.email}<span class="label-text-alt text-red-500">{$errors.email}</span>{/if}
	</label>
	<button class="btn btn-primary btn-sm mt-8">Reset Password</button>
</form>
