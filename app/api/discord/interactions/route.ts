import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import { verifyKey } from "discord-interactions";

export async function POST(req: Request) {
    // Discord headers are case-sensitive in some environments
    const signature = req.headers.get("X-Signature-Ed25519") || req.headers.get("x-signature-ed25519");
    const timestamp = req.headers.get("X-Signature-Timestamp") || req.headers.get("x-signature-timestamp");

    const rawBody = await req.text();

    // Debugging the key length (Should be exactly 64)
    console.log("Key Length:", process.env.DISCORD_PUBLIC_KEY?.length);

    const isValidRequest = verifyKey(
        rawBody,
        signature || "",
        timestamp || "",
        process.env.DISCORD_PUBLIC_KEY || ""
    );

    if (!isValidRequest) {
        console.error("❌ Signature invalide");
        // Log the headers to see if they are actually arriving
        console.log("Sig:", signature, "TS:", timestamp);
        return new Response("Invalid request signature", { status: 401 });
    }

    const body = JSON.parse(rawBody);
    if (body.type === 1) {
        // Use a standard Response for the handshake to avoid Next.js overhead
        return new Response(JSON.stringify({ type: 1 }), {
            headers: { "Content-Type": "application/json" },
            status: 200
        });
    }
    try {
        if (body.type === 3) {
            const { custom_id } = body.data;
            const receiverId = body.user.id;
            const userId = body.user.id;
            console.log(`🔍 Bouton cliqué: ${custom_id} par ${userId}`);

            // --- CASE 1: RÉSOLUTION (Le message avec OUI/NON) ---
            if (custom_id.startsWith("resolve_")) {
                const [action, betId, winnerId] = custom_id.split(":");
                console.log(`💾 Recherche du pari pour l'utilisateur: ${custom_id.startsWith("resolve_") ? userId : custom_id.split(":")[1]}`);
                // 1. Find the bet from the person who clicked (receiverId) to get the senderId
                const receiverBets = await kv.lrange<any>(`user:bets:${receiverId}`, 0, -1);
                const rIndex = receiverBets.findIndex(b => b.id === betId);

                if (rIndex === -1) {
                    return NextResponse.json({ type: 4, data: { content: "Pari introuvable.", flags: 64 } });
                }

                const bet = typeof receiverBets[rIndex] === 'string' ? JSON.parse(receiverBets[rIndex]) : receiverBets[rIndex];
                // 2. Resolve the credits logic
                if (action === "resolve_accept") {
                    const totalPot = bet.amount * 2;
                    await kv.incrby(`user:credits:${winnerId}`, totalPot);
                    bet.status = "COMPLETED";
                } else {
                    await kv.incrby(`user:credits:${bet.senderId}`, bet.amount);
                    await kv.incrby(`user:credits:${bet.receiverId}`, bet.amount);
                    bet.status = "CONTESTED";
                }
                const senderBets = await kv.lrange<any>(`user:bets:${bet.senderId}`, 0, -1);
                const sIndex = senderBets.findIndex(b => b.id === betId);

                // 4. Update both lists using their respective correct indexes
                if (rIndex !== -1) {
                    await kv.lset(`user:bets:${receiverId}`, rIndex, JSON.stringify(bet));
                }
                if (sIndex !== -1) {
                    await kv.lset(`user:bets:${bet.senderId}`, sIndex, JSON.stringify(bet));
                }

                return NextResponse.json({
                    type: 7,
                    data: {
                        content: action === "resolve_accept"
                            ? `**Pari validé.** <@${winnerId}> encaisse **${bet.amount * 2} CR** !`
                            : `**Pari contesté.** Les mises ont été rendues.`,
                        components: []
                    }
                });
            }

            // --- CASE 2: ACCEPTATION INITIALE (Le premier DM) ---
            const parts = custom_id.split(":");
            if (parts.length === 3) {
                const [action, senderId, betId] = parts;

                const bets = await kv.lrange<any>(`user:bets:${senderId}`, 0, -1);
                const betIndex = bets.findIndex((b) => b.id === betId);

                if (betIndex === -1) return NextResponse.json({ type: 4, data: { content: "Pari expiré.", flags: 64 } });
                const bet = bets[betIndex];

                if (action === "accept") {
                    await kv.decrby(`user:credits:${receiverId}`, bet.amount);
                    bet.status = "ACTIVE";

                    // Mise à jour SENDER
                    await kv.lset(`user:bets:${senderId}`, betIndex, JSON.stringify(bet));
                    // Ajout RECEIVER (pour qu'il ait aussi l'overlay)
                    await kv.lpush(`user:bets:${receiverId}`, JSON.stringify(bet));

                    return NextResponse.json({
                        type: 7,
                        data: { content: `**Pari Accepté !** Bonne chance aux deux.`, components: [] }
                    });
                }

                if (action === "deny") {
                    bet.status = "DECLINED";
                    await kv.lset(`user:bets:${senderId}`, betIndex, JSON.stringify(bet));
                    return NextResponse.json({ type: 7, data: { content: "❌ Pari refusé.", components: [] } });
                }
            }
        }
        return NextResponse.json({ error: "Unknown interaction" }, { status: 400 });
    } catch (err: any) {
        console.error("ERREUR CRITIQUE INTERACTION:", err.message, err.stack);

        // On renvoie TOUJOURS une réponse à Discord, même en cas d'erreur
        return NextResponse.json({
            type: 4,
            data: { content: `Erreur interne: ${err.message}`, flags: 64 }
        });
    }
}