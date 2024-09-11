<form method="POST" class="flex flex-col max-w-screen-sm gap-2">
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text">Email</span>
		</div>
		<input
			type="email"
			name="email"
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
			placeholder="Type here"
			class="input input-bordered w-full input-md"
		/>
	</label>
	<button class="btn btn-primary btn-sm mt-8">Login</button>
</form>

<div class="mt-3">
	<a href="/signin/reset" class="btn btn-link">Forgot your password?</a>
</div>
