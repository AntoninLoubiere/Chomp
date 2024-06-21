import { getGameScore, resetGrid, shuffleArray } from "$lib";
import { broadcastMessage, sendCurrentTurn, syncPlayer, type ChompServer, type ChompServerPlayer } from "./chomp_server";
import { currentRemoteTournoi } from "./stores";

export function chomp(cs: ChompServer, player: ChompServerPlayer, i: number, j: number) {
    currentRemoteTournoi.update(tournoi => {
        if (tournoi.turnOrder[tournoi.currentTurn] != player.id || i < 0 || j < 0 ||
            tournoi.grid[i] < j || tournoi.status == 'ended') {
            syncPlayer(cs, player);
            return tournoi;
        }

        applyChomp(tournoi, i, j);
        broadcastMessage(cs, {msg: 'chomp', i, j});
        if (i == 0 && j == 0) {
            // Perte
            tournoi.status = 'ended';
            for (let i = 0; i < tournoi.nb_players; i++) {
                tournoi.players[tournoi.turnOrder[i]].score += getGameScore(tournoi, i);
            }
            broadcastMessage(cs, {msg: 'game-tournoi', tournoi});
        } else {
            tournoi.currentTurn = (tournoi.currentTurn + 1) % tournoi.nb_players;
            sendCurrentTurn(cs, tournoi);
        }
        return tournoi;
    });
}

export function newChompRound(cs: ChompServer) {
    currentRemoteTournoi.update(tournoi => {
        if (tournoi.status == 'ended') {
            resetGrid(tournoi);
            shuffleArray(tournoi.turnOrder);
            tournoi.currentTurn = 0;
            tournoi.status = 'playing';
            broadcastMessage(cs, {msg: 'game-tournoi', tournoi});
        }
        return tournoi;
    })
}

export function applyChomp(tournoi: ChompRemoteTournoi, i: number, j: number) {
    if (tournoi.grid[i] <= j) return;

    for (let k = i; j < tournoi.height && tournoi.grid[k] > j; k++) {
        tournoi.grid[k] = j;
    }
}
