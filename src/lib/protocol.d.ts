import type { ChompClientPlayer } from "./chomp_client";
import type { ServerStatus } from "./chomp_server";

export type MessageProtocol =
    {
        msg: 'conn-accepted';
        status: ServerStatus;
        width: number,
        height: number,
        players_name: ChompClientPlayer[];
    } |
    {
        msg: 'player-new' | 'player-update-name';
        name: string;
        id: string;
    } |
    {
        msg: 'player-remove' | 'player-disconnected' | 'player-reconnected',
        id: string
    } |
    {
        msg: 'game-update-size',
        width: number,
        height: number
    } |
    {
        msg: 'server-status',
        status: ServerStatus
    } |
    {
        msg: 'game-tournoi',
        tournoi: ChompRemoteTournoi
    } |
    {
        msg: 'chomp',
        i: number,
        j: number
    } |
    {
        msg: 'sync' | 'game-new-round'
    } |
    {
        msg: 'turn',
        id: string,
        nb: number,
    } |
    {
        msg: 'error',
        type: 'invalid-token' | 'invalid-request'
    }