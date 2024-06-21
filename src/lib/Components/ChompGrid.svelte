<script lang="ts">
	import { createEventDispatcher } from "svelte";

    export let grid: ChompGrid;

    const dispatcher = createEventDispatcher();

    function chomp(i: number, j: number) {
        dispatcher('chomp', {i, j})
    }

    $: itemHeight = 90 / grid.height;
    $: itemWidth = 95 / grid.width;
</script>

<div class="grid" style="grid: repeat({grid.height}, min({itemHeight}vh, {itemWidth}vw)) / repeat({grid.width}, min({itemHeight}vh, {itemWidth}vw);">
    {#each grid.grid as row, i (i)}
        {#each new Array(row) as _, j (j)}
            <button class:origin={i == 0 && j == 0} class="c" style="grid-row-start: {i + 1}; grid-column-start: {j + 1};" on:click={() => chomp(i, j)}></button>
        {/each}
    {/each}
</div>

<style>
    .grid {
        display: grid;
        /* border: solid black 2px; */
    }

    .c {
        background-color: hsl(25, 39%, 43%);
        border: solid .4rem;
        border-bottom-color: hsl(25, 100%, 18%);
        border-right-color: hsl(25, 70%, 25%);
        border-top-color: hsl(25, 32%, 50%);
        border-left-color: hsl(25, 50%, 35%);
        cursor: pointer;
    }

    .c:hover {
        filter:brightness(125%);
    }

    .origin {
        background-color: hsl(0, 39%, 43%);
        border-bottom-color: hsl(0, 100%, 18%);
        border-right-color: hsl(0, 70%, 25%);
        border-top-color: hsl(0, 32%, 50%);
        border-left-color: hsl(0, 50%, 35%);
    }
</style>