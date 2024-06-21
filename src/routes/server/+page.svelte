<script lang="ts">
	import { newTournoi } from "$lib";
	import LinkShare from "$lib/Components/LinkShare.svelte";
	import { updateGameSize, updateServerName } from "$lib/chomp_server";
	import { chompServer, currentTournoi } from "$lib/stores";
	import { onMount } from "svelte";

    let name = "";

    onMount(() => {
        if ($chompServer) {
            name = $chompServer.players[$chompServer.id].name || '';
        }
        if ($currentTournoi.width <= 0 || $currentTournoi.height <= 0) {
            $currentTournoi = newTournoi(10, 10, 0);
        }
    })

    function updateName() {
        if ($chompServer != undefined) {
            $chompServer.players[$chompServer.id].name = name
            updateServerName($chompServer, name);
        }
    }

    function updateSize() {
        if ($chompServer != undefined) {
            updateGameSize($chompServer, $currentTournoi.width, $currentTournoi.height);
        }
    }
</script>
{#if $chompServer}
<div class="container">
    <div>
        <h3>GRILLE :</h3>
        <input type="number" id="width" size=4 max="100" min="1" bind:value={$currentTournoi.width}
        on:change={updateSize} on:input={updateSize}>
        &times;
        <input type="number" size=4 min="1" max="100" bind:value={$currentTournoi.height}
        on:change={updateSize} on:input={updateSize}>
    </div>
    <div>
        <h3>NOM :</h3>
        <input type="text" bind:value={name} on:change={updateName} on:input={updateName}>
        <h3>{Object.keys($chompServer.players).length} JOUEURS :</h3>
        <ul>
            {#each Object.values($chompServer.players) as p (p.id)}
                <li title={p.id}>{p.name}</li>
            {/each}
        </ul>
    </div>
    <div>
        <h3>LIEN</h3>
        <LinkShare id={$chompServer.connId}/>
    </div>
</div>
{/if}
<style>
    h3 {
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