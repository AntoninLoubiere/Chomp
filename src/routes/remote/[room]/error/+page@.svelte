<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>
<div>Une erreur est survenue.</div>
<a href="{base}/remote/{$page.params.room}">Réessayer</a>