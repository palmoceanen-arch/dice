import type { WebSocket } from 'ws';
export declare function handleMessage(ws: WebSocket, message: any, userId: number | null): Promise<number | null>;
export declare function handleDisconnect(userId: number): void;
//# sourceMappingURL=handlers.d.ts.map