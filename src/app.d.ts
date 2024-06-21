// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface ChompGrid {
		width: number;
		height: number;
		grid: number[];
	}

	type ChompGameStatus = 'playing' | 'ended';

	interface ChompGame extends ChompGrid {
		players: string[];
		nb_players: number;
		turnOrder: number[];
		currentTurn: number;
		status: ChompGameStatus;
	}

	interface ChompTournoi extends ChompGame {
		score: number[];
	}

	interface ChompTournoiPlayer {
		id: string;
		name: string;
		score: number;
		disconnected: boolean;
	}

	interface ChompRemoteTournoi extends ChompGrid {
		status: ChompGameStatus;
		turnOrder: string[];
		currentTurn: number;
		nb_players: number;
		players: {[id: string]: ChompTournoiPlayer};
	}
}

export {};
