export interface ReferralStats {
    totalReferrals: number;
    activeReferrals: number;
    referralsWithThreeGames: number;
    referralsWithPurchase: number;
    totalRewards: number;
}
export interface ReferralInfo {
    id: number;
    referredNickname: string;
    gamesPlayed: number;
    firstPurchaseMade: boolean;
    createdAt: Date;
}
export declare function generateReferralCode(): Promise<string>;
export declare function processReferral(referredUserId: number, referralCode: string): Promise<boolean>;
export declare function incrementReferralGames(userId: number): Promise<void>;
export declare function markReferralPurchase(userId: number): Promise<void>;
export declare function getReferralStats(userId: number): Promise<ReferralStats>;
export declare function getReferralList(userId: number): Promise<ReferralInfo[]>;
//# sourceMappingURL=referrals.d.ts.map