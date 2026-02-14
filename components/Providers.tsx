"use client";

import { SessionProvider } from "next-auth/react";
import { CreditsProvider } from "@/app/providers/CreditsProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      refetchInterval={5 * 60}
    >
      <CreditsProvider>
        {children}
      </CreditsProvider>
    </SessionProvider>
  );
}