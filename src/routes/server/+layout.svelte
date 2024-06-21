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
