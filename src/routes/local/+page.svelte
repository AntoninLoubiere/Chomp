<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { newTournoiFromPlayers } from "$lib";
	import { currentTournoi } from "$lib/stores";

    let width = 10;
    let height = 10;
    let players: string[] = new Array(3).fill("").map((_, i) => `Joueur ${i + 1}`);

    function play() {
        $currentTournoi = newTournoiFromPlayers(width, height, players);
        goto(`${base}/local/game`);
    }
</script>

<div class="container">
    <div>
        <label for="width">GRILLE :</label>
        <input type="number" id="width" size=4 max="100" min="1" bind:value={width}>
        &times;
        <input type="number" size=4 min="1" max="100" bind:value={height}>
    </div>
    <div>
        <label for="width">{players.length} JOUEURS :</label>
        <ul>
            {#each players as p, i}
                <li><input type="text" bind:value={p}>
                <button class="rem" on:click={() => {players.splice(i, 1); players = players;}}>&Cross;</button></li>
            {/each}
        </ul>
        <button class="bt" on:click={() => {players.push(`Joueur ${players.length + 1}`); players=players;}}>Ajouter un joueur</button>
        <button class="bt play" on:click={play}>JOUER</button>
    </div>
</div>

<style>
    label {
        display: block;
        font-weight: 500;
        font-size: x-large;
        margin: .5rem 0;
        text-align: center;
    }

    .container {
        display: flex;
        margin-left: auto;
        margin-right: auto;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    ul {
        margin: 0;
        padding: 0;
    }

    li {
        margin: .25rem 0 ;
    }

    .bt {
        width: 100%;
        margin: 0.25rem 0;
    }

    .rem {
        padding: 0;
        height: 100%;
        font-weight: bold;
        margin: 0 .2rem;
        border: none;
        background-color: unset;
        cursor: pointer;
    }

    .rem:hover {
        color: red;
    }

    .play {
        margin: 0.5rem 0;
    }
</style>