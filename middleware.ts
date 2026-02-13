// middleware.ts
export { auth as middleware } from "@/auth"

export const config = {
  // On protège les pages sensibles, mais on laisse l'API et les assets libres
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}