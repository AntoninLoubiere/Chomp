<script lang="ts">
	import ChompGrid from "./ChompGrid.svelte";

    export let game: ChompGame;

    function endChomp() {
        game.currentTurn -= 1;
        game.status = 'ended';
    }

    function chomp(e: CustomEvent<{i: number, j: number}>) {
        game.currentTurn = (game.currentTurn + 1) % game.players.length;
    }
</script>

<div class="container">
    <ChompGrid grid={game} on:chomp={chomp} on:end-chomp={endChomp}/>
    <ul class:ended={game.status == 'ended'}>
        {#each game.players as p, i (i)}
            <li class:currentPlayer={i == game.currentTurn}>{p}</li>
        {/each}
    </ul>
</div>

<style>

    .container {
        display: flex;
        flex-wrap: wrap;
        min-width: min-content;
        justify-content: space-evenly;
        gap: 1rem;
    }

    .ended li {
        color: green;
    }

    .ended li.currentPlayer {
        color: red;
    }

    .currentPlayer {
        font-weight: bold;
    }
</style>