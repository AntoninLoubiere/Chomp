<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import LinkShare from "$lib/Components/LinkShare.svelte";
	import { cleanDisconnected, serverStartGame, setServerStatus, updateGameSize, updateServerName } from "$lib/chomp_server";
	import { chompServer, currentRemoteTournoi } from "$lib/stores";
	import { onMount } from "svelte";

    let name = "";

    onMount(() => {
        if ($chompServer) {
            name = $chompServer.players[$chompServer.id].name || '';
            cleanDisconnected($chompServer)
            if ($chompServer.status == 'in-game') {
                setServerStatus($chompServer, 'lobby');
            }
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
            updateGameSize($chompServer, $currentRemoteTournoi.width, $currentRemoteTournoi.height);
        }
    }
</script>
{#if $chompServer}
<div class="container">
    <div>
        <h3>GRILLE :</h3>
        <input type="number" id="width" size=4 max="100" min="1" bind:value={$currentRemoteTournoi.width}
        on:change={updateSize} on:input={updateSize}>
        &times;
        <input type="number" size=4 min="1" max="100" bind:value={$currentRemoteTournoi.height}
        on:change={updateSize} on:input={updateSize}>
    </div>
    <div>
        <h3>NOM :</h3>
        <input class="full-input" type="text" bind:value={name} on:change={updateName} on:input={updateName}>
        <h3>{Object.keys($chompServer.players).length} JOUEURS :</h3>
        <ul>
            {#each Object.values($chompServer.players) as p (p.id)}
                <li title={p.id}>{p.name}</li>
            {/each}
        </ul>
        <button class="bt" on:click={() => serverStartGame($chompServer)}>COMMENCER LA PARTIE</button>
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

    .full-input {
        width: 100%;
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
</style>
