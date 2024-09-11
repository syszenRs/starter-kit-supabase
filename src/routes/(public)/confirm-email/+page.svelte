<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let email = '';
	let hasEmail = true;

	onMount(() => {
		const emailForCode = $page.url.searchParams.get('email') as string;
		email = emailForCode;
		hasEmail = !!email;
		console.log('email', email, hasEmail);
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
			bind:value={email}
			placeholder="Type here"
			class="input input-bordered w-full input-md {hasEmail ? 'hidden' : ''}"
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Code</span>
		</div>
		<input
			type="number"
			name="code"
			placeholder="Type here"
			class="input input-bordered w-full input-md"
		/>
	</label>
	<button class="btn btn-primary btn-sm mt-8">Confirm</button>
</form>
