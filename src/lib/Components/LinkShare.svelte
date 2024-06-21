<script lang="ts">
	import { page } from '$app/stores';
    import QRCode from 'qrcode'
    export let id: string;
    $: url = new URL("/remote/" + id, $page.url);

    $: data = QRCode.toDataURL(url.href);
</script>
<div>
    <a href="{url.href}" target="_blank">{id}</a>
    {#await data then d}
        <img src={d} alt={url.href}/>
    {/await}
</div>

<style>
    img {
        display: block;
        width: 100%;
    }
</style>