<script lang="ts">
	import { APP_REDIRECT } from '$constant/app-redirect-url.js';

	let { data } = $props();
</script>

<p>Hey {data.user?.email} from dashboard!</p>
