<script lang="ts">
	import { stopChompServer } from "$lib/chomp_server";
	import { onMount } from "svelte";

    onMount(() => {
        return () => {
            stopChompServer();
        }
    })
</script>

<slot></slot>
<a href="/">Lien</a>
<a href="/server/">Server</a>
<a href="/server/game">Server Game</a>