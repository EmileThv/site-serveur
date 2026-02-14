// app/api/discord/interactions/route.ts
import { NextResponse } from "next/server";
import { verifyKey } from "discord-interactions";

// Prevent any caching of the handler
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const signature = req.headers.get("x-signature-ed25519");
  const timestamp = req.headers.get("x-signature-timestamp");
  const publicKey = process.env.DISCORD_PUBLIC_KEY?.trim(); // trim just in case

  if (!signature || !timestamp || !publicKey) {
    console.error("Missing signature/timestamp/public key");
    return new Response("Invalid request signature", { status: 401 });
  }

  const rawBody = await req.text();
  try {
    // Safest: pass bytes, not a JS string
    const isValid = await verifyKey(
      new TextEncoder().encode(rawBody),
      signature,
      timestamp,
      publicKey
    );

    if (!isValid) {
      console.error("❌ Invalid request signature");
      return new Response("Invalid request signature", { status: 401 });
    }
  } catch (e: any) {
    console.error("verifyKey threw:", e?.message ?? e);
    return new Response("Invalid request signature", { status: 401 });
  }

  // At this point, it's actually from Discord
  const body = JSON.parse(rawBody);

  // 1) Handle PING right away to satisfy the Developer Portal check
  if (body.type === 1) {
    // Respond with PONG (type: 1)
    return NextResponse.json({ type: 1 }, { status: 200 });
  }

  // 2) Add your real interaction handling here (buttons, slash commands, etc.)
  // Keep it inside try/catch and after signature verification.

  return NextResponse.json({ error: "Unknown interaction" }, { status: 400 });
}