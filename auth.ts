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
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const userId = profile?.id || user?.id;
      if (!userId) return false;

      try {
        // 1. Initialiser les crédits (si premier login)
        const currentCredits = await kv.get(`user:credits:${userId}`);
        if (currentCredits === null) {
          await kv.set(`user:credits:${userId}`, 5000);
        }

        // 2. Enregistrer le profil pour qu'il soit listable dans /api/users
        await kv.set(`user:profile:${userId}`, {
          id: userId,
          name: user.name,
          image: user.image,
        });

        // 3. Ajouter l'ID à la liste globale des joueurs
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

        // Récupérer les crédits en temps réel depuis KV
        const credits = await kv.get<number>(`user:credits:${token.sub}`);
        
        // @ts-ignore
        session.user.credits = credits ?? 5000;
      }
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
});