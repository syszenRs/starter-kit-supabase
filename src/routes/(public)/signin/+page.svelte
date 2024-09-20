<script>
	import { superForm } from 'sveltekit-superforms/client';
	import { MessageQueue } from '$store/flash-message.svelte';
	import { MessageType } from '$dto/flash-message';

	let data = $props();

	const { form, errors, enhance } = superForm(data.data.form);

	$effect(() => {
		if (data.form?.error) {
			MessageQueue.add(MessageType.error, {
				title: 'Sign-in',
				description: data.form.error
			});

			data.form.error = '';
		}
	});

	function setPersona() {
		$form.email = 'test@email.com';
		$form.password = 'Abc123!';
	}
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Email</span>
		</div>
		<input
			type="email"
			name="email"
			bind:value={$form.email}
			placeholder="Type here"
			class="input input-bordered w-full input-md"
		/>
		{#if $errors.email}<span class="label-text-alt text-red-500">{$errors.email}</span>{/if}
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Password</span>
		</div>
		<input
			type="password"
			name="password"
			bind:value={$form.password}
			placeholder="Type here"
			class="input input-bordered w-full input-md"
		/>
		{#if $errors.password}<span class="label-text-alt text-red-500">{$errors.password}</span>{/if}
	</label>
	<button class="btn btn-primary btn-sm mt-8">Login</button>
</form>

<div class="mt-3">
	<a href="/signin/reset" class="btn btn-link">Forgot your password?</a>
</div>

<button onclick={setPersona} class="btn btn-sm max-w-screen-sm">Set login user</button>
