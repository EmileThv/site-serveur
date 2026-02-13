// auth.ts
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { prisma } from "@/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.id) return false;

      // On cast les types unknown en string pour Prisma
      const discordId = profile.id as string;
      const name = (profile.username || profile.global_name || "Utilisateur") as string;
      const image = (profile.image_url || profile.avatar) as string;

      await prisma.user.upsert({
        where: { discordId: discordId },
        update: {
          name: name,
          image: image,
        },
        create: {
          discordId: discordId,
          name: name,
          email: profile.email as string,
          image: image,
          credits: 5000,
        },
      });
      return true;
    },
    async session({ session, token }) {
      // sub contient l'id du compte (le discordId ici)
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { discordId: token.sub },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          // @ts-ignore
          session.user.credits = dbUser.credits;
        }
      }
      return session;
    },
  },
});