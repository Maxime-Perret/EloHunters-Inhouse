export interface user {
    position: string;
    username: string;
    id: string;
    mvps: number;
    realMVP: number;
    wins: number;
    losses: number;
    winrate: number;
}
export declare function addMedal(rank: number): string;
export declare function computeRaw(ordered_users: user[]): user[];
//# sourceMappingURL=rawUsers.d.ts.map