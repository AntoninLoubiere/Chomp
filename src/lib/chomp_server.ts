import Peer from 'peerjs'
import type { DataConnection } from 'peerjs'
import { chompServer, currentTournoi } from './stores';
import { get } from 'svelte/store';
import { randomId } from '$lib/utils'
import type { MessageProtocol } from './protocol';
// import { ICE_SERVERS } from './iceservers';
export interface ChompPlayer {
    conn?: DataConnection;
    id: string;
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
        [id: string]: ChompPlayer;
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

            const players: { [id: string]: ChompPlayer } = {};
            players[id] = { id, connId, name: "Hôte" };
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
    if (cs.status != 'lobby' || conn.metadata.id == undefined) {
        conn.close();
        return;
    }

    console.log('Accept', conn.metadata.id)
    const id = conn.metadata.id as string;
    const name = id.substring(0, 6);
    broadcastMessage(cs, { msg: 'player-new', name, id });
    const player = {
        id,
        conn,
        name,
        connId: conn.peer,
    };
    cs.players[id] = player;
    chompServer.set(cs);
    conn.on('open', () => {
        const tournoi = get(currentTournoi)
        conn.send({
            msg: 'conn-accepted',
            width: tournoi.width,
            height: tournoi.height,
            players_name: Object.values(cs.players).map(p => { return { id: p.id, name: p.name } }),
            status: cs.status
        } satisfies MessageProtocol)

    });

    conn.on('data', m => {
        // @ts-expect-error
        onServerMessage(cs, player, m)
    })

    conn.on('close', () => {
        delete cs.players[id];
        broadcastMessage(cs, { msg: 'player-remove', id });
        chompServer.set(cs);
    })
}


function broadcastMessage(cs: ChompServer, m: MessageProtocol) {
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

function onServerMessage(cs: ChompServer, player: ChompPlayer, m: MessageProtocol) {
    console.log("Received message", m)
    switch (m.msg) {
        case 'player-update-name':
            m.id = player.id;
            m.name.substring(0, 100);
            forwardMessage(cs, m, player.id);
            cs.players[player.id].name = m.name;
            chompServer.set(cs);
            break;
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
    broadcastMessage(cs, { msg: 'player-update-name', id: cs.id, name })
}

export function updateGameSize(cs: ChompServer, width: number, height: number) {
    broadcastMessage(cs, {msg: 'game-update-size', width, height})
}
