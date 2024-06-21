export function fullChompGrid(width: number, height: number): ChompGrid {
    return {
        width, height, grid: new Array(height).fill(width)
    }
}

export function newGame(width: number, height: number, nbPlayers: number): ChompGame {
    const game: ChompGame = {
        currentTurn: 0,
        status: 'playing',
        turnOrder: new Array(nbPlayers).fill(0).map((_, i) => i),
        players: new Array(nbPlayers).fill("").map((_, i) => `Joueur ${i}`),
        ...fullChompGrid(width, height)
    };
    shuffleArray(game.turnOrder);
    return game;
}


export function newGameFromPlayers(width: number, height: number, players: string[]): ChompGame {
    const game: ChompGame = {
        currentTurn: 0,
        status: 'playing',
        players,
        turnOrder: new Array(players.length).fill(0).map((_, i) => i),
        ...fullChompGrid(width, height)
    };
    shuffleArray(game.turnOrder);
    return game;
}

export function newTournoi(width: number, height: number, nbPlayers: number): ChompTournoi {
    return {
        score: new Array(nbPlayers).fill(0),
        ...newGame(width, height, nbPlayers)
    }
}

export function newTournoiFromPlayers(width: number, height: number, players: string[]): ChompTournoi {
    return {
        score: new Array(players.length).fill(0),
        ...newGameFromPlayers(width, height, players)
    }
}

export function getGameScore(game: ChompGame, p: number): number {
    const off = ((game.currentTurn - p + game.players.length) % game.players.length);
    return off;
}

export function resetGrid(grid: ChompGrid) {
    for (let i = 0; i < grid.height; i++) {
        grid.grid[i] = grid.width;
    }
}

export function shuffleArray(a: any[]) {
    for (let i = 0; i < a.length - 1; i++) {
        let j = Math.floor(Math.random() * (a.length - i)) + i;
        let temp = a[j];
        a[j] = a[i];
        a[i] = temp;
    }
}
