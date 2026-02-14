import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json([]);
        }

        // On récupère tous les paris de l'utilisateur
        const bets = await kv.lrange<any>(`user:bets:${userId}`, 0, -1);
        
        // On ne garde que ceux qui sont "ACTIVE" (pari accepté par les deux)
        const activeBets = bets.filter(bet => bet.status === "ACTIVE");

        return NextResponse.json(activeBets);
    } catch (error) {
        console.error("API_ACTIVE_BETS_ERROR:", error);
        // On renvoie un tableau vide plutôt qu'une erreur 500 pour éviter de crash le frontend
        return NextResponse.json([]);
    }
}