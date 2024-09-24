<script lang="ts">
	import { page } from '$app/stores';
	import { useFormErrorHook } from '$lib/utils/hooks';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';

	let data = $props();

	const { form, errors, enhance } = superForm(data.data.form);

	let hasEmail = $state(true);

	$effect(useFormErrorHook(data, 'Email confirmation'));

	onMount(() => {
		const emailForCode = $page.url.searchParams.get('email') as string;
		$form.email = emailForCode;
		hasEmail = !!$form.email;
	});
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label class="form-control w-full {hasEmail ? 'hidden' : ''}">
		<div class="label">
			<span class="label-text">Email</span>
		</div>
		<input
			type={hasEmail ? 'hidden' : 'email'}
			name="email"
			bind:value={$form.email}
			placeholder="Type here"
			class="input input-bordered w-full input-md {hasEmail ? 'hidden' : ''}"
		/>
		{#if $errors.email}<span class="label-text-alt text-red-500">{$errors.email}</span>{/if}
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Code</span>
		</div>
		<input type="number" name="code" bind:value={$form.code} placeholder="Type here" class="input input-bordered w-full input-md" />
		{#if $errors.code}<span class="label-text-alt text-red-500">{$errors.code}</span>{/if}
	</label>
	<button class="btn btn-primary btn-sm mt-8">Confirm</button>
</form>
