import Peer from 'peerjs'
import type { DataConnection } from 'peerjs'

import { chompClient, currentTournoi } from './stores';
import { get } from 'svelte/store';
import { randomId } from './utils';
import type { MessageProtocol } from './protocol';
// import { ICE_SERVERS } from './iceservers';
export interface ChompPlayerClient {
    id: string;
    name: string;
}

export type ServerStatus = 'lobby' | 'in-game';

export interface ChompClient {
    peer: Peer;
    conn: DataConnection;
    status: ServerStatus;
    id: string;
    connId: string;
    players: {
        [id: string]: ChompPlayerClient;
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

function _createChompClient(dest: string): Promise<ChompClient> {
    return new Promise((resolve, reject) => {
        const peer = new Peer("", /*{ config: {'iceServers': ICE_SERVERS}}*/);
        peer.on('open', () => {
            const id = getId();
            let client: ChompClient | undefined = undefined;

            const conn = peer.connect(dest, {metadata: { id }, reliable: true});
            conn.on('open', () => {
                //@ts-expect-error
                conn.on('data', (e: MessageProtocol) => {
                    console.log("Received", e)
                    if (client) {
                        onClientData(client, e);
                        return;
                    }
                    if (e.msg == 'conn-accepted') {
                        const players: {[id: string]: ChompPlayerClient} = {};
                        for (const p of e.players_name) {
                            players[p.id] = { id: p.id, name: p.name };
                        }
                        client = {
                            peer,
                            id,
                            conn,
                            connId: dest,
                            status: e.status,
                            players
                        }
                        // const username = localStorage.getItem('last-username');
                        // if (username) {
                        //     updateClientName(client, username);
                        //     players[id].name = username;
                        // }
                        resolve(client);
                        currentTournoi.update(t => {
                            t.width = e.width;
                            t.height = e.height;
                            return t;
                        })

                    }
                })
            })
    
            conn.on('error', (e) => {
                console.log("Error", e)
                if (!client) {
                    reject(e);
                }
            })
        })
        peer.on('error', console.error)
    })
}

export async function createChompClient(dest: string) {
    stopChompClient();
    chompClient.set(await _createChompClient(dest));
}

function onClientData(cc: ChompClient, m: MessageProtocol) {
    switch (m.msg) {
        case 'player-new':
            cc.players[m.id] = { id: m.id, name: m.name };
            chompClient.set(cc);
            break;

        case 'player-update-name':
            cc.players[m.id].name = m.name;
            chompClient.set(cc);
            break;

        case 'player-remove':
            delete cc.players[m.id]
            chompClient.set(cc);
            break;

        case 'game-update-size':
            currentTournoi.update(t => {
                t.width = m.width;
                t.height = m.height;
                return t
            })
    }
}

export function stopChompClient() {
    const cs = get(chompClient);
    if (cs) {
        console.log("Destroy client");
        cs.peer.destroy();
        chompClient.set(undefined);
    }
}

export function updateClientName(cs: ChompClient, name: string) {
    cs.conn.send({ msg: 'player-update-name', id: cs.id, name })
    localStorage.setItem('last-username', name);
}
