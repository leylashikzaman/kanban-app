"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import KanbanBoard from "@/components/board/KanbanBoard";

export default function BoardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "#0f0f13", color: "#9090a8",
      fontFamily: "sans-serif"
    }}>Yükleniyor...</div>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0f0f13" }}>
      <div style={{
        height: 56, background: "#17171d", borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", padding: "0 20px", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, background: "#6c63ff", borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13
          }}>⊞</div>
          <span style={{ color: "#e8e8f0", fontWeight: 600, fontSize: 15 }}>FlowBoard</span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ color: "#9090a8", fontSize: 12 }}>{user?.email}</span>
        <button onClick={handleLogout} style={{
          background: "#1e1e26", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, color: "#9090a8", padding: "5px 14px",
          fontSize: 12, cursor: "pointer", fontFamily: "inherit"
        }}>Çıkış</button>
      </div>
      <KanbanBoard userId={user?.id} />
    </div>
  );
}