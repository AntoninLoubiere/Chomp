<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import ChompRemoteTournoi from "$lib/Components/ChompRemoteTournoi.svelte";
	import { chomp, newChompRound } from "$lib/chomp_server_game";
	import { chompServer, currentRemoteTournoi } from "$lib/stores";
	import { onMount } from "svelte";

    onMount(() => {
        if ($chompServer?.status == 'lobby') {
            goto(`${base}/server`);
        }
    })
</script>

{#if $chompServer}
    <ChompRemoteTournoi game={$currentRemoteTournoi}
        on:chomp={e => chomp($chompServer, $chompServer?.players[$chompServer.id], e.detail.i, e.detail.j)}
        on:next-round={_ => newChompRound($chompServer)}/>
{:else}
    Pas de serveur
{/if}
