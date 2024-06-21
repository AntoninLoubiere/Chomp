<script lang="ts">
	import { getGameScore, resetGrid, shuffleArray } from "$lib";
	import { flip } from "svelte/animate";
import ChompGrid from "./ChompGrid.svelte";

    export let game: ChompTournoi;

    function endChomp() {
        if (game.status != 'ended') {
            for (let i = 0; i < game.players.length; i++) {
                game.score[game.turnOrder[i]] += getGameScore(game, i);
            }
            game.status = 'ended';
        }
    }

    function chomp(e: CustomEvent<{i: number, j: number}>) {
        if (game.status != 'ended') {
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
        <ChompGrid grid={game} on:chomp={chomp} on:end-chomp={endChomp}/>
        {#if game.status == 'ended'}
            <button class="next-round" on:click={nextRound}>Manche suivante</button>
        {/if}
    </div>
    <ul class:ended={game.status == 'ended'} class="player-board">
        {#each game.turnOrder as i, j (i)}
            <li animate:flip={{ duration: 1000 }} class:currentPlayer={j == game.currentTurn}>{game.players[i]}: {game.score[i]}
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

    .player-board {
        width: 200px;
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