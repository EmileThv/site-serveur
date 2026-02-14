// lib/discord.ts
export async function sendDiscordBetRequest({
    receiverId,
    senderName,
    senderId,
    amount,
    title,
    betId
}: {
    receiverId: string,
    senderName: string,
    senderId: string,
    amount: number,
    title: string,
    betId: string
}) {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    // 1. Create a DM Channel with the receiver
    const channelRes = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${BOT_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipient_id: receiverId })
    });

    const channel = await channelRes.json();
    if (!channel.id) throw new Error("Could not create DM channel");

    // 2. Send the Message with Buttons
    return await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${BOT_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: `### NOUVEAU PARI REÇU !\n**${senderName}** vous défie pour **${amount} CR** sur : \`${title}\``,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "ACCEPTER",
                            style: 3,
                            custom_id: `accept:${senderId}:${betId}`
                        },
                        {
                            type: 2,
                            label: "DÉCLINER",
                            style: 4,
                            custom_id: `deny:${senderId}:${betId}`
                        }
                    ]
                }
            ]
        })
    });
}

export async function sendDiscordResolutionRequest({ opponentId, initiatorName, amount, betId, claimedWinnerId }: any) {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

    // 1. Ouvrir le DM
    const channelRes = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
        method: 'POST',
        headers: { 'Authorization': `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient_id: opponentId })
    });
    const channel = await channelRes.json();

    // 2. Envoyer le message de validation
    return await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bot ${BOT_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `🚨 **Demande de clôture de pari !**\n\n**${initiatorName}** déclare que le gagnant des **${amount} CR** est <@${claimedWinnerId}>.\n\nEs-tu d'accord avec ce résultat ?`,
            components: [{
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 3, // Vert
                        label: "OUI, ACCEPTER",
                        custom_id: `resolve_accept:${betId}:${claimedWinnerId}`
                    },
                    {
                        type: 2,
                        style: 4, // Rouge
                        label: "NON, CONTESTER",
                        custom_id: `resolve_contest:${betId}`
                    }
                ]
            }]
        })
    });
}