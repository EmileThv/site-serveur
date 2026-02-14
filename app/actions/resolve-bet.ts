"use server";
import { kv } from "@vercel/kv";
import { sendDiscordResolutionRequest } from "@/lib/discord"; // On va créer ça


async function updateBetInKV(userId: string, betId: string, updatedData: any) {
    const key = `user:bets:${userId}`;
    const bets = await kv.lrange<any>(key, 0, -1);
    const index = bets.findIndex(b => b.id === betId);

    if (index !== -1) {
        await kv.lset(key, index, JSON.stringify(updatedData));
    }
}

export async function initiateResolution(bet: any, winnerId: string, initiatorId: string) {
    // 1. Mettre à jour le statut du pari
    bet.status = "PENDING_VALIDATION";
    bet.claimedWinner = winnerId; // On stocke qui a été désigné gagnant

    // On met à jour le pari pour les DEUX joueurs dans KV
    await updateBetInKV(bet.senderId, bet.id, bet);
    await updateBetInKV(bet.receiverId, bet.id, bet);

    // 2. Envoyer le DM au perdant désigné (ou à l'autre joueur)
    const opponentId = initiatorId === bet.senderId ? bet.receiverId : bet.senderId;

    await sendDiscordResolutionRequest({
        opponentId,
        initiatorName: bet.senderName || "SI TU VOIS CA TRES GROS BUG", // Utilise maintenant la propriété stockée
        amount: bet.amount * 2,
        betId: bet.id,
        claimedWinnerId: winnerId
    });

    return { success: true };
}