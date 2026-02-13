"use server"

import { kv } from "@vercel/kv";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createBet(receiverId: string, amount: number, title: string) {
  const session = await auth();
  
  // 1. Vérification Auth
  if (!session?.user?.id) throw new Error("AUTH_REQUIRED");
  const senderId = session.user.id;

  // 2. Sécurité : Pas de pari contre soi-même
  if (senderId === receiverId) throw new Error("SELF_BET_PROHIBITED");

  // 3. Récupération des crédits (KV GET)
  const senderCredits = await kv.get<number>(`user:credits:${senderId}`);
  
  if (senderCredits === null || senderCredits < amount) {
    throw new Error("INSUFFICIENT_CREDITS");
  }

  // 4. Mise à jour des crédits (KV SET)
  const newBalance = senderCredits - amount;
  await kv.set(`user:credits:${senderId}`, newBalance);

  // 5. Création du pari (On le stocke dans une liste pour l'historique)
  const betData = {
    id: `bet_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    title: title || "UNNAMED_TRANSACTION",
    senderId,
    receiverId,
    status: "PENDING",
    createdAt: Date.now(),
  };

  // On ajoute le pari à la liste du parieur ET du receveur
  await kv.lpush(`user:bets:${senderId}`, JSON.stringify(betData));
  await kv.lpush(`user:bets:${receiverId}`, JSON.stringify(betData));

  revalidatePath("/bets");
  
  return { success: true, newBalance };
}