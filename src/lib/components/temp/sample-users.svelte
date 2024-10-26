<script>
	import Button from './button.svelte';

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

<div class="flex flex-col max-w-screen-sm border-4 border-orange-300 p-2 mt-6 gap-4">
	<p>User Setup</p>
	<Button onclick={set_existing}>Set existing userV1</Button>
	<Button onclick={set_existing2}>Set existing userV2</Button>
	<Button onclick={set_wrongPW}>Set wrong userV1 password</Button>
	<Button onclick={set_WrongEmail}>Set inexistent email</Button>
</div>
