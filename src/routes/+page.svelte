<script lang="ts">
	import { base } from "$app/paths";

	let id = "";
</script>
<div class="container">
	<a href="{base}/local">Partie en local</a>
	<a href="{base}/server">Créer une partie à distance</a>
	<div>
		<label for="id">Rejoindre une partie à distance:</label>
		<input type="text" bind:value={id}>
		<a href="{base}/remote/{id}"><button>Rejoindre</button></a>
	</div>
</div>

<style>
	.container {
		display: grid;
	}
</style>