<script lang="ts">
	import { chompClient, currentRemoteTournoi } from "$lib/stores";
    import { updateClientName } from "$lib/chomp_client";
	import { onMount } from "svelte";
	import LinkShare from "$lib/Components/LinkShare.svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

    let name = "";

    onMount(() => {
        if ($chompClient) {
            name = $chompClient.players[$chompClient.id]?.name || '';
            if ($chompClient.status == 'in-game') {
                goto(`/remote/${$page.params.room}/game`);
            }
        }
    })

    function updateName() {
        if ($chompClient != undefined) {
            $chompClient.players[$chompClient.id].name = name;
            updateClientName($chompClient, name);
        }
    }

</script>
{#if $chompClient}
<div class="container">
    <div class="center">
        <label for="width">GRILLE :</label>
        {$currentRemoteTournoi.width}&times;{$currentRemoteTournoi.height}
    </div>
    <div>
        <label for="name">NOM :</label>
        <input type="text" bind:value={name} on:change={updateName} on:input={updateName}>
        <label for="width">{Object.keys($chompClient.players).length} JOUEURS :</label>
        <ul>
            {#each Object.values($chompClient.players) as p (p.id)}
                <li title="{p.id}">{p.name}</li>
            {/each}
        </ul>
        <h3>LIEN</h3>
        <LinkShare id={$chompClient.connId}/>
    </div>
</div>
{/if}
<style>
    .center {
        text-align: center;;
    }

    input {
        width: 100%
    }

    label, h3 {
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