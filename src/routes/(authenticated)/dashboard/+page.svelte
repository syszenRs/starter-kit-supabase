<script>
	let { data } = $props();
</script>

<p>Hey {data.user?.email} from dashboard!</p>

<a href="/change-email" class="btn btn-link"> Change email </a>
