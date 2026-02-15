import Link from "next/link";

export default function NotInServerPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 680, textAlign: "center" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Vous ne faites pas parti du serveur discord ! </h1>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/" style={{ padding: "8px 14px", background: "#111827", color: "white", borderRadius: 6, textDecoration: "none" }}>
            Go to Home
          </Link> 
        </div>
      </div>
    </main>
  );
}
