import { createChompServer } from '$lib/chomp_server';
import type { LayoutLoad } from './$types';

export const load = (async () => {
    await createChompServer();
    return {};
}) satisfies LayoutLoad;