"use client";
import { useState } from "react";

const TAG_OPTIONS = [
  { key: "blue", label: "Geliştirme", bg: "rgba(108,99,255,0.18)", color: "#8b84ff" },
  { key: "green", label: "Tamamlandı", bg: "rgba(62,207,142,0.15)", color: "#3ecf8e" },
  { key: "amber", label: "Bekliyor", bg: "rgba(245,166,35,0.15)", color: "#f5a623" },
  { key: "red", label: "Acil", bg: "rgba(255,107,107,0.15)", color: "#ff6b6b" },
];

export default function CardModal({ card, onSave, onClose }: any) {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [tags, setTags] = useState<string[]>(card?.tags || []);

  function toggleTag(key: string) {
    setTags(tags.includes(key) ? tags.filter(t => t !== key) : [...tags, key]);
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim(), tags });
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, backdropFilter: "blur(4px)"
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#17171d", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 16, width: "100%", maxWidth: 460,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <span style={{ color: "#e8e8f0", fontSize: 15, fontWeight: 600 }}>
            {card ? "Kartı Düzenle" : "Kart Ekle"}
          </span>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 7, border: "none",
            background: "#1e1e26", color: "#9090a8", cursor: "pointer", fontSize: 16
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#9090a8" }}>Başlık *</label>
            <input
              value={title} onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              placeholder="Ne yapılacak?" autoFocus
              style={{
                background: "#1e1e26", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "#e8e8f0", padding: "9px 12px",
                fontSize: 13, outline: "none", fontFamily: "inherit"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#9090a8" }}>Açıklama</label>
            <textarea
              value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Detaylar..." rows={3}
              style={{
                background: "#1e1e26", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "#e8e8f0", padding: "9px 12px",
                fontSize: 13, outline: "none", fontFamily: "inherit", resize: "none"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: "#9090a8" }}>Etiketler</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TAG_OPTIONS.map(tag => (
                <button key={tag.key} onClick={() => toggleTag(tag.key)} style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500,
                  fontFamily: "monospace", cursor: "pointer", border: "1px solid",
                  background: tag.bg, color: tag.color,
                  borderColor: tags.includes(tag.key) ? tag.color : "transparent",
                  opacity: tags.includes(tag.key) ? 1 : 0.5,
                  transition: "all 0.15s"
                }}>{tag.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "0 20px 20px", display: "flex", gap: 8, justifyContent: "flex-end"
        }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            fontFamily: "inherit", cursor: "pointer", background: "#1e1e26",
            color: "#9090a8", border: "1px solid rgba(255,255,255,0.1)"
          }}>İptal</button>
          <button onClick={handleSave} style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500,
            fontFamily: "inherit", cursor: "pointer", background: "#6c63ff",
            color: "#fff", border: "none"
          }}>Kaydet</button>
        </div>
      </div>
    </div>
  );
}