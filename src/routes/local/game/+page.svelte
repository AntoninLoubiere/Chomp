<script lang="ts">
	import ChompTournoi from "$lib/Components/ChompTournoi.svelte";
	import { currentTournoi } from "$lib/stores";

</script>

<ChompTournoi game={$currentTournoi}/>