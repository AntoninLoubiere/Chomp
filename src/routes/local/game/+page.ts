import { currentTournoi } from '$lib/stores';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    if (get(currentTournoi).width <= 0) {
        throw redirect(301, '/local');
    }
    return {};
}) satisfies PageLoad;