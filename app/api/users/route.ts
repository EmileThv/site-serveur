// app/api/users/route.ts
import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  // On récupère tout le monde SAUF l'utilisateur connecté (on ne parie pas contre soi-même)
  const users = await prisma.user.findMany({
    where: {
      NOT: { id: session?.user?.id }
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
    take: 10 // Pour pas exploser ta grille de 10 prises
  });

  return NextResponse.json(users);
}