<script>
	import { onMount } from 'svelte';

	let { data } = $props();
	onMount(() => {
		console.log('ping onMount');
	});
	//TODO CHECK WTF IS HAPPENING CANT USE APP-REDIRECT-URLS HERE
</script>

<p>Hey {data.user?.email} from dashboard!</p>

<a href="/" class="btn btn-link"> Change email </a>
