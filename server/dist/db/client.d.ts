import pg, { QueryResultRow } from 'pg';
export declare const pool: import("pg").Pool;
export declare function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<pg.QueryResult<T>>;
export declare function getClient(): Promise<import("pg").PoolClient>;
export declare function getPoolStats(): {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
};
//# sourceMappingURL=client.d.ts.map