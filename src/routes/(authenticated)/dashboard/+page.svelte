<script lang="ts">
	import { APP_REDIRECT } from '$constant/routes-url.js';

	let { data } = $props();
</script>

<p class="text-center pt-10 text-xl">Hey <b>{data.user?.email}</b>, you reached the dashboard!</p>
