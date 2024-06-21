import { newRemoteTournoi, newTournoi } from "$lib";
import { writable } from "svelte/store";
import type { ChompServer } from "./chomp_server";
import type { ChompClient } from "./chomp_client";

export const currentTournoi = writable<ChompTournoi>(newTournoi(0, 0, 0));
export const currentRemoteTournoi = writable<ChompRemoteTournoi>(newRemoteTournoi(10, 10, []));
export const chompServer = writable<ChompServer | undefined>(undefined);
export const chompClient = writable<ChompClient | undefined>(undefined);
