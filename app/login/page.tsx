"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setError("");
    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setError("Şimdi giriş yapabilirsiniz!");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("E-posta veya şifre hatalı.");
      else router.push("/board");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0f0f13", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif"
    }}>
      <div style={{
        background: "#17171d", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16, padding: 36, width: "100%", maxWidth: 400,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 32, height: 32, background: "#6c63ff", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
          }}>⊞</div>
          <span style={{ color: "#e8e8f0", fontWeight: 600, fontSize: 16 }}>FlowBoard</span>
        </div>
        <h1 style={{ color: "#e8e8f0", fontSize: 20, fontWeight: 600, marginBottom: 6 }}>
          {isRegister ? "Hesap Oluştur" : "Giriş Yap"}
        </h1>
        <p style={{ color: "#9090a8", fontSize: 13, marginBottom: 24 }}>
          {isRegister ? "Hemen başla, ücretsiz." : "Kanban tahtana devam et."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email" placeholder="E-posta" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{
              background: "#1e1e26", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#e8e8f0", padding: "10px 14px",
              fontSize: 13, outline: "none", fontFamily: "inherit"
            }}
          />
          <input
            type="password" placeholder="Şifre" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{
              background: "#1e1e26", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#e8e8f0", padding: "10px 14px",
              fontSize: 13, outline: "none", fontFamily: "inherit"
            }}
          />
          {error && (
            <div style={{
              color: error.includes("doğrulayın") ? "#3ecf8e" : "#ff6b6b",
              fontSize: 12, padding: "8px 12px", borderRadius: 8,
              background: error.includes("doğrulayın") ? "rgba(62,207,142,0.1)" : "rgba(255,107,107,0.1)"
            }}>{error}</div>
          )}
          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              background: "#6c63ff", color: "#fff", border: "none",
              borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              fontFamily: "inherit", marginTop: 4
            }}
          >
            {loading ? "Bekle..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </button>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            style={{
              background: "transparent", border: "none", color: "#9090a8",
              fontSize: 12, cursor: "pointer", fontFamily: "inherit"
            }}
          >
            {isRegister ? "Zaten hesabın var mı? Giriş yap" : "Hesabın yok mu? Kayıt ol"}
          </button>
        </div>
      </div>
    </div>
  );
}
