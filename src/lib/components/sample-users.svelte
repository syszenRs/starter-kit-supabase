<script>
	let { form } = $props();

	function set_existing() {
		$form.email = 'test@email.com';
		$form.password = 'Abc123!';
	}

	function set_existing2() {
		$form.email = 'test@email.com';
		$form.password = 'Abc123!!';
	}

	function set_wrongPW() {
		$form.email = 'test@email.com';
		$form.password = 'Abc3!11';
	}

	function set_WrongEmail() {
		$form.email = 'test@eeeeemail.com';
		$form.password = 'Abc123!!';
	}
</script>

<div class="flex flex-col max-w-screen-sm bg-neutral-400 p-2 mt-6">
	<p>User Setting</p>
	<button onclick={set_existing} class="btn btn-sm max-w-screen-sm mt-3">Set existing user</button>
	<button onclick={set_existing2} class="btn btn-sm max-w-screen-sm mt-3">Set existing user V2</button>
	<button onclick={set_wrongPW} class="btn btn-sm max-w-screen-sm mt-3">Set wrong user password</button>
	<button onclick={set_WrongEmail} class="btn btn-sm max-w-screen-sm mt-3">Set wrong user email</button>
</div>
