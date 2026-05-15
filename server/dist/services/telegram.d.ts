export declare function createStarsInvoice(userId: number, itemId: number, itemName: string, itemDescription: string, priceStars: number): Promise<{
    success: boolean;
    invoiceUrl?: string;
    error?: string;
}>;
export declare function handlePreCheckoutQuery(preCheckoutQuery: {
    id: string;
    from: {
        id: number;
    };
    currency: string;
    total_amount: number;
    invoice_payload: string;
}): Promise<boolean>;
export declare function handleSuccessfulPayment(telegramUserId: number, payment: {
    currency: string;
    total_amount: number;
    invoice_payload: string;
    telegram_payment_charge_id: string;
    provider_payment_charge_id: string;
}): Promise<{
    success: boolean;
    itemId?: number;
    oderId?: number;
}>;
export declare function getPendingPurchase(payload: string): {
    oderId: number;
    itemId: number;
    priceStars: number;
} | undefined;
export declare function sendGameInvite(telegramId: number, fromNickname: string, lobbyId: string, gameMode: string): Promise<boolean>;
//# sourceMappingURL=telegram.d.ts.map