<script>
	export let data;

	$: ({ user } = data);
</script>

<p>Hey {user?.email} from dashboard!</p>

<a href="/change-email" class="btn btn-link"> Change email </a>
