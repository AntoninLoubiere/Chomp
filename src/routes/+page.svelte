<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";

	let id = "";
</script>
<div class="container">
	<a href="{base}/local">Partie en local</a>
	<a href="{base}/server">Créer une partie à distance</a>
	<div>
		<label for="id">Rejoindre une partie à distance:</label>
		<input type="text" bind:value={id}>
		<button on:click={() => goto(`${base}/remote/${id}`)}>Rejoindre</button>
	</div>
</div>

<style>
	.container {
		display: grid;
	}
</style>