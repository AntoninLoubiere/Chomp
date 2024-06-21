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
		turnOrder: number[];
		currentTurn: number;
		status: ChompGameStatus;
	}

	interface ChompTournoi extends ChompGame {
		score: number[];
	}
}

export {};
