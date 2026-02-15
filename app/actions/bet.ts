"use server";
import { kv } from "@vercel/kv";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { sendDiscordBetRequest } from "@/lib/discord";

export async function createBet(receiverId: string, amount: number, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("AUTH_REQUIRED");

  const senderId = session.user.id;

  try {
    // 1. On récupère les crédits (juste pour le log)
    const currentCredits = await kv.get<number>(`user:credits:${senderId}`) || 5000;

    
    if (currentCredits < amount) {
       throw new Error("INSUFFICIENT_CREDITS");
    }
    
    // Prevent betting yourself
    if (receiverId === senderId) {
      throw new Error("CANNOT_BET_SELF");
    }

    // 2. Check that neither sender nor receiver is currently involved in any active/pending bets
    const parseList = (arr: any[]) => arr.map((b) => (typeof b === "string" ? JSON.parse(b) : b));

    const senderRaw = await kv.lrange<any>(`user:bets:${senderId}`, 0, -1);
    const senderBets = parseList(senderRaw || []);
    const senderHasActive = senderBets.some((b: any) => b?.status === "ACTIVE" || b?.status === "PENDING");
    if (senderHasActive) {
      throw new Error("SENDER_HAS_ACTIVE_BET");
    }

    const receiverRaw = await kv.lrange<any>(`user:bets:${receiverId}`, 0, -1);
    const receiverBets = parseList(receiverRaw || []);
    const receiverHasActive = receiverBets.some((b: any) => b?.status === "ACTIVE" || b?.status === "PENDING");
    if (receiverHasActive) {
      throw new Error("RECEIVER_HAS_ACTIVE_BET");
    }
    

    // 3. On enregistre le pari dans KV pour l'historique
    // app/actions/bet.ts
    const betData = {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      amount,
      title: title || "DEMO_BET",
      senderId,
      senderName: session.user.name, // AJOUTE CECI ICI
      receiverId,
      status: "PENDING",
      createdAt: Date.now(),
    };

    // Inside your createBet function in bet.tsx
    await kv.lpush(`user:bets:${senderId}`, JSON.stringify(betData));

    // ADD THIS: Trigger the Discord notification
    // We pass the receiverId (Discord ID), the sender's name, and the bet details
    // Inside your createBet function in bet.ts
    await sendDiscordBetRequest({
      receiverId,
      senderId: session.user.id,
      senderName: session.user.name || "Un utilisateur",
      amount,
      title: title || "DEMO_BET",
      betId: betData.id
    });

    revalidatePath("/bets");
    return { success: true };

  } catch (e) {
    console.error("DEBUG_BET_ERROR:", e);
  }
}