<script>
	import { APP_REDIRECT } from '$constant/app-redirect-url.js';

	let { data } = $props();
</script>

<p>Hey {data.user?.email} from dashboard!</p>

<a href={APP_REDIRECT.CHANGE_EMAIL} class="btn btn-link"> Change email </a>
