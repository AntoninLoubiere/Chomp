<script lang="ts">
	import ChompTournoi from "$lib/Components/ChompTournoi.svelte";
	import { currentRemoteTournoi } from "$lib/stores";

</script>

<ChompTournoi game={$currentRemoteTournoi}/>