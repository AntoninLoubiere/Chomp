<script lang="ts">
	import { getGameScore, resetGrid, shuffleArray } from "$lib";
    import ChompGrid from "./ChompGrid.svelte";

    export let game: ChompTournoi;


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

    function nextRound() {
        resetGrid(game);
        shuffleArray(game.turnOrder);
        game.currentTurn = 0;
        game.status = 'playing';
    }
</script>

<div class="container">
    <div>
        <ChompGrid grid={game} on:chomp={chomp}/>
        {#if game.status == 'ended'}
            <button class="next-round" on:click={nextRound}>Manche suivante</button>
        {/if}
    </div>
    <ul class:ended={game.status == 'ended'}>
        {#each game.turnOrder as i, j (i)}
            <li class:currentPlayer={j == game.currentTurn}>{game.players[i]}: {game.score[i]}
                {#if game.status == 'ended'}
                    (+ {getGameScore(game, j)})
                {/if}
            </li>
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

    .next-round {
        margin: .5rem 0;
        width: 100%;
    }
</style>