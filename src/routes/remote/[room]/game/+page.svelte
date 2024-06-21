<script lang="ts">
	import { onMount } from 'svelte';
	import { chompClient, currentRemoteTournoi } from '$lib/stores';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ChompRemoteTournoi from '$lib/Components/ChompRemoteTournoi.svelte';
	import { sendChompClient, sendNextRound } from '$lib/chomp_client';

    onMount(() => {
        if ($chompClient?.status == 'lobby') {
            goto(`/remote/${$page.params.room}`);
        }
    })
</script>

{#if $chompClient}
    <ChompRemoteTournoi game={$currentRemoteTournoi}
     on:chomp={e => sendChompClient($chompClient, e.detail.i, e.detail.j)}
     on:next-round={() => sendNextRound($chompClient)} />
{:else}
    Pas de serveur
{/if}
