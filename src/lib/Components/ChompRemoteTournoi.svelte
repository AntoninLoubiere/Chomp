<script lang="ts">
	import { getGameScore } from "$lib";
	import ChompGrid from "./ChompGrid.svelte";
	import { createEventDispatcher } from "svelte";

    export let game: ChompRemoteTournoi;

    const dispatcher = createEventDispatcher();
    function nextRound() {
        dispatcher('next-round');
    }
</script>

<div class="container">
    <div>
        <ChompGrid grid={game} on:chomp/>
        {#if game.status == 'ended'}
            <button class="next-round" on:click={nextRound}>Manche suivante</button>
        {/if}
    </div>
    <ul class:ended={game.status == 'ended'} class="player-board">
        {#each game.turnOrder as id, j (id)}
            {@const p = game.players[id]}
            <li title="{p.id}" class:currentPlayer={j == game.currentTurn}>{p.name}: {p.score}
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