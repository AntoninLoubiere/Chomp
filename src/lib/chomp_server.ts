import Peer from 'peerjs'
import type { DataConnection } from 'peerjs'
import { chompServer, currentRemoteTournoi, currentTournoi } from './stores';
import { get } from 'svelte/store';
import { randomId } from '$lib/utils'
import type { MessageProtocol } from './protocol';
import { goto } from '$app/navigation';
import { newRemoteTournoi } from '$lib';
import { chomp, newChompRound } from './chomp_server_game';
import { base } from '$app/paths';
// import { ICE_SERVERS } from './iceservers';
export interface ChompServerPlayer {
    conn?: DataConnection;
    id: string;
    token: string;
    disconnected: boolean;
    connId: string;
    name: string;
}

export type ServerStatus = 'lobby' | 'in-game';

export interface ChompServer {
    peer: Peer;
    status: ServerStatus;
    id: string;
    connId: string;
    players: {
        [id: string]: ChompServerPlayer;
    };
}

function getId() {
    let id = sessionStorage.getItem("user-id");
    if (!id) {
        id = randomId();
        sessionStorage.setItem("user-id", id);
    }
    return id;
}

function _createChompServer(tryOldId = true): Promise<ChompServer> {
    return new Promise((resolve, reject) => {
        const peer = new Peer(tryOldId && sessionStorage.getItem('server-conn-id') || "",
                /*{ config: { 'iceServers': ICE_SERVERS } }*/);
        peer.on('open', (connId) => {
            let id = getId();
            console.log("Server Connected", { id, connId });
            sessionStorage.setItem('server-conn-id', connId);

            const players: { [id: string]: ChompServerPlayer } = {};
            players[id] = { id, connId, token: '', disconnected: false,
                name: localStorage.getItem("last-username") || "Hôte" };
            const cs: ChompServer = {
                peer,
                id,
                connId,
                status: 'lobby',
                players
            };
            peer.on('connection', onServerConnetion.bind(null, cs))
            resolve(cs);
        });

        peer.on('error', (e) => {
            if (e.type == 'unavailable-id') {
                _createChompServer(false).then(resolve).catch(reject)
            }
        });

    })
}

export async function createChompServer() {
    stopChompServer();
    chompServer.set(await _createChompServer());
}

function onServerConnetion(cs: ChompServer, conn: DataConnection) {
    if (conn.metadata.id == undefined || conn.metadata.id == cs.id) {
        conn.send({ msg: "error", type: 'invalid-request' } satisfies MessageProtocol)
        conn.close();
        return;
    }

    const id = conn.metadata.id as string;
    const token = conn.metadata.token || '' as string
    const name = id.substring(0, 6);
    if (cs.players[id] && cs.players[id].token != token) {
        console.error("Invalid token", id);
        conn.send({msg: "error", type: 'invalid-token'} satisfies MessageProtocol)
        conn.close();
        return;
    }

    if (cs.status != 'lobby' && cs.players[id]?.token != token) {
        console.error("Invalid token", id);
        conn.send({ msg: "error", type: 'invalid-token' } satisfies MessageProtocol)
        conn.close();
        return;
    }

    console.log('Accept', conn.metadata.id, conn.metadata.token)
    if (cs.status == 'lobby')
        broadcastMessage(cs, { msg: 'player-new', name, id } satisfies MessageProtocol);
    else
        broadcastMessage(cs, {msg: 'player-reconnected', id})

    const player = {
        id,
        token,
        disconnected: false,
        conn,
        name,
        connId: conn.peer,
    };
    cs.players[id] = player;
    chompServer.set(cs);
    conn.on('open', () => {
        const tournoi = get(currentRemoteTournoi)
        conn.send({
            msg: 'conn-accepted',
            width: tournoi.width,
            height: tournoi.height,
            players_name: Object.values(cs.players).map(p => { return { id: p.id, name: p.name } }),
            status: cs.status
        } satisfies MessageProtocol)

        if (cs.status == 'in-game') {
            tournoi.players[id].disconnected = false;
            currentRemoteTournoi.set(tournoi);
            conn.send({msg: 'game-tournoi', tournoi} satisfies MessageProtocol)
        }

    });

    conn.on('data', m => {
        // @ts-expect-error
        onServerMessage(cs, player, m)
    })

    conn.on('close', () => {
        if (cs.status == 'lobby') {
            delete cs.players[id];
            broadcastMessage(cs, { msg: 'player-remove', id });
            chompServer.set(cs);
        } else {
            delete cs.players[id].conn;
            cs.players[id].disconnected = true;
            broadcastMessage(cs, { msg: 'player-disconnected', id });
            currentRemoteTournoi.update(t => {
                if (id in t.players)
                    t.players[id].disconnected = true;
                return t;
            })
        }
    })
}


export function broadcastMessage(cs: ChompServer, m: MessageProtocol) {
    for (let p of Object.values(cs.players)) {
        if (p.conn) {
            p.conn.send(m);
        }
    }
}

function forwardMessage(cs: ChompServer, m: MessageProtocol, from: string) {
    for (let p of Object.values(cs.players)) {
        if (p.conn && p.id != from) {
            p.conn.send(m);
        }
    }
}

function onServerMessage(cs: ChompServer, player: ChompServerPlayer, m: MessageProtocol) {
    switch (m.msg) {
        case 'player-update-name':
            m.id = player.id;
            m.name.substring(0, 100);
            forwardMessage(cs, m, player.id);
            cs.players[player.id].name = m.name;
            chompServer.set(cs);
            break;

        case 'sync':
            syncPlayer(cs, player);
            break;

        case 'chomp':
            chomp(cs, player, m.i, m.j);
            break;

        case 'game-new-round':
            newChompRound(cs);
            break;

        default:
            console.info("Unknown message", m);
            break;
    }
}

export function syncPlayer(cs: ChompServer, player: ChompServerPlayer) {
    if (cs.status == 'in-game') {
        const tournoi = get(currentRemoteTournoi);
        player.conn?.send({ msg: 'game-tournoi', tournoi } satisfies MessageProtocol)
    } else {
        player.conn?.send({ msg: 'server-status', status: 'lobby' } satisfies MessageProtocol);
    }
}

export function stopChompServer() {
    const cs = get(chompServer);
    if (cs) {
        console.log("Destroy server");
        cs.peer.destroy();
        chompServer.set(undefined);
    }
}

export function updateServerName(cs: ChompServer, name: string) {
    localStorage.setItem("last-username", name);
    broadcastMessage(cs, { msg: 'player-update-name', id: cs.id, name })
}

export function updateGameSize(cs: ChompServer, width: number, height: number) {
    broadcastMessage(cs, {msg: 'game-update-size', width, height})
}

export function serverStartGame(cs: ChompServer) {
    currentRemoteTournoi.update(t => {
        cleanDisconnected(cs);
        const tournoi = newRemoteTournoi(t.width, t.height, Object.values(cs.players).map(p => {return {
            id: p.id,
            name: p.name,
            score: 0,
            disconnected: false
        }}));
        broadcastMessage(cs, {msg: 'game-tournoi', tournoi});
        setServerStatus(cs, 'in-game');
        goto(`${base}/server/game`);
        return tournoi;
    })
}

export function setServerStatus(cs: ChompServer, status: ServerStatus) {
    cs.status = status;
    broadcastMessage(cs, { msg: 'server-status', status: cs.status });
}

export function sendCurrentTurn(cs: ChompServer, tournoi: ChompRemoteTournoi) {
    broadcastMessage(cs, {msg: 'turn', id: tournoi.turnOrder[tournoi.currentTurn], nb: tournoi.currentTurn});
}

export function cleanDisconnected(cs: ChompServer) {
    for (let p of Object.values(cs.players)) {
        if (p.disconnected)
            delete cs.players[p.id];
    }
    chompServer.set(cs);
}
