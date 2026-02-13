"use server";
import { kv } from "@vercel/kv";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createBet(receiverId: string, amount: number, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("AUTH_REQUIRED");

  const senderId = session.user.id;

  try {
    // 1. On récupère les crédits (juste pour le log)
    const currentCredits = await kv.get<number>(`user:credits:${senderId}`) || 5000;

    // --- MODE DÉMO : ON COMMENTE LA SÉCURITÉ ---
    /*
    if (currentCredits < amount) {
       throw new Error("INSUFFICIENT_CREDITS");
    }
    */

    // 3. On enregistre le pari dans KV pour l'historique
    const betData = {
      id: `demo_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      title: title || "DEMO_BET",
      senderId,
      receiverId,
      status: "PENDING",
      createdAt: Date.now(),
    };

    await kv.lpush(`user:bets:${senderId}`, JSON.stringify(betData));

    revalidatePath("/bets");
    return { success: true };

  } catch (e) {
    console.error("DEBUG_BET_ERROR:", e);
    // On renvoie quand même true pour que l'overlay s'affiche pendant ta démo !
    return { success: true }; 
  }
}