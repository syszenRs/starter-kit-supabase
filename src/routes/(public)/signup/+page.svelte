<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<form method="POST" use:enhance class="flex flex-col max-w-screen-sm gap-2">
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Email</span>
		</div>
		<input
			type="email"
			name="email"
			value="test@email.com"
			placeholder="Type here"
			class="input input-bordered w-full input-md"
		/>
	</label>
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Password</span>
		</div>
		<input
			type="password"
			name="password"
			value="Abc123!"
			placeholder="Type here"
			class="input input-bordered w-full input-md"
		/>
	</label>
	<button class="btn btn-primary btn-sm mt-8">Register</button>
</form>
