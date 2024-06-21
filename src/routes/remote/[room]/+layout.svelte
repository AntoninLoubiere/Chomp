<script lang="ts">
	import { stopChompClient } from "$lib/chomp_client";
	import { onMount } from "svelte";

    onMount(() => {
        return () => {
            stopChompClient();
        }
    })
</script>

<slot></slot>
