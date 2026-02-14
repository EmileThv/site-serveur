import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { kv } from "@vercel/kv";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      // Added guilds scope to see the user's servers
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds",
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }) {
      const userId = profile?.id || user?.id;
      if (!userId || !account?.access_token) return false;

      try {
        // --- DISCORD SERVER CHECK ---
        const res = await fetch("https://discord.com/api/users/@me/guilds", {
          headers: { Authorization: `Bearer ${account.access_token}` },
        });

        if (!res.ok) return false;

        const guilds = await res.json();
        const TARGET_GUILD_ID = "YOUR_DISCORD_SERVER_ID_HERE"; // Put your Server ID here

        const isMember = guilds.some((g: any) => g.id === TARGET_GUILD_ID);
        
        // If not in the server, reject login
        if (!isMember) return false; 

        // --- EXISTING KV LOGIC ---
        const currentCredits = await kv.get(`user:credits:${userId}`);
        if (currentCredits === null) {
          await kv.set(`user:credits:${userId}`, 5000);
        }

        await kv.set(`user:profile:${userId}`, {
          id: userId,
          name: user.name,
          image: user.image,
        });

        await kv.sadd("all_players", userId);

        return true;
      } catch (e) {
        console.error("KV_SIGNIN_ERROR:", e);
        return false;
      }
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        const credits = await kv.get<number>(`user:credits:${token.sub}`);
        // @ts-ignore
        session.user.credits = credits ?? 5000;
      }
      return session;
    },

    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId;
        // Store the access token in the JWT so it's available for the signIn callback
        token.accessToken = account.access_token;
      }
      return token;
    }
  },
});