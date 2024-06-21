import { createChompClient } from '$lib/chomp_client';
import type { LayoutLoad } from './$types';

export const load = (async ({params}) => {
    await createChompClient(params.room);
    return {};
}) satisfies LayoutLoad;