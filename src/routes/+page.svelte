<script lang="ts">
	import { newTournoi } from "$lib";
	import ChompTournoi from "$lib/Components/ChompTournoi.svelte";

	let width = 10;
	let height = 12;
	let players = 3;
	let game = newTournoi(width, height, players);
</script>
<div>
	<input type="number" bind:value={width}/>
	<input type="number" bind:value={height}/>
	<button on:click={() => game = newTournoi(width, height, players)}>Nouvelle grille</button>
</div>
<ChompTournoi {game}></ChompTournoi>