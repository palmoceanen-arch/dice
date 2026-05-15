import type { FriendWithUser } from '../types/index.js';
interface FriendRequestRow {
    id: number;
    from_user_id: number;
    to_user_id: number;
    status: string;
    created_at: string;
    from_nickname: string;
    from_telegram_username: string | null;
    from_avatar_url: string | null;
}
export declare function getFriends(userId: number): Promise<FriendWithUser[]>;
export declare function sendFriendRequest(fromUserId: number, toUserId: number): Promise<{
    success: boolean;
    requestId?: number;
}>;
export declare function getPendingFriendRequests(userId: number): Promise<FriendRequestRow[]>;
export declare function acceptFriendRequest(requestId: number, userId: number): Promise<{
    success: boolean;
    fromUserId?: number;
}>;
export declare function declineFriendRequest(requestId: number, userId: number): Promise<boolean>;
export declare function addFriend(userId: number, friendId: number, source?: 'search' | 'game' | 'invite'): Promise<boolean>;
export declare function removeFriend(userId: number, friendId: number): Promise<boolean>;
export declare function areFriends(userId: number, friendId: number): Promise<boolean>;
export {};
//# sourceMappingURL=friends.d.ts.map