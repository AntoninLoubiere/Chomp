<script lang="ts">
	import ChompGrid from "./ChompGrid.svelte";

    export let game: ChompGame;

    function chomp(e: CustomEvent<{i: number, j: number}>) {
        const i = e.detail.i;
        const j = e.detail.j;
        if (game.grid[i] <= j) return;

        for (let k = i; j < game.height && game.grid[k] > j; k++) {
            game.grid[k] = j;
        }

        if (i == 0 && j == 0) {
            game.status = 'ended';
        } else {
            game.currentTurn = (game.currentTurn + 1) % game.players.length;
        }
    }
</script>

<div class="container">
    <ChompGrid grid={game} on:chomp={chomp} />
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