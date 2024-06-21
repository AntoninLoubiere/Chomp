import { currentTournoi } from '$lib/stores';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load = (async () => {
    if (get(currentTournoi).width <= 0) {
        throw redirect(301, `${base}/local`);
    }
    return {};
}) satisfies PageLoad;