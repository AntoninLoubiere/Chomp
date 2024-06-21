import type { ChompPlayerClient } from "./chomp_client";

export type MessageProtocol =
    {
        msg: 'conn-accepted';
        status: ServerStatus;
        width: number,
        height: number,
        players_name: ChompPlayerClient[];
    } |
    {
        msg: 'player-new';
        name: string;
        id: string;
    } |
    {
        msg: 'player-update-name',
        name: string,
        id: string
    } |
    {
        msg: 'player-remove',
        id: string
    } |
    {
        msg: 'game-update-size',
        width: number,
        height: number
    }