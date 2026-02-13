"use server"

import { prisma } from "@/prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createBet(receiverId: string, amount: number, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("AUTH_REQUIRED");

  // On récupère l'ID Prisma (ou DiscordId selon ton schéma)
  const senderId = session.user.id;

  // Sécurité : Pas de pari contre soi-même (même si ton UI l'empêche)
  if (senderId === receiverId) throw new Error("SELF_BET_PROHIBITED");

  return await prisma.$transaction(async (tx) => {
    const sender = await tx.user.findUnique({ where: { id: senderId } });
    
    if (!sender || sender.credits < amount) {
      throw new Error("INSUFFICIENT_CREDITS");
    }

    // On bloque les crédits immédiatement
    await tx.user.update({
      where: { id: senderId },
      data: { credits: { decrement: amount } }
    });

    const newBet = await tx.bet.create({
      data: {
        amount,
        title: title || "UNNAMED_TRANSACTION",
        senderId,
        receiverId,
        status: "PENDING"
      }
    });

    revalidatePath("/bets"); // Rafraîchit les données du client
    return newBet;
  });
}