"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TAG_STYLES: any = {
  blue: { background: "rgba(108,99,255,0.18)", color: "#8b84ff" },
  green: { background: "rgba(62,207,142,0.15)", color: "#3ecf8e" },
  amber: { background: "rgba(245,166,35,0.15)", color: "#f5a623" },
  red: { background: "rgba(255,107,107,0.15)", color: "#ff6b6b" },
};
const TAG_NAMES: any = {
  blue: "Geliştirme", green: "Tamamlandı", amber: "Bekliyor", red: "Acil"
};

export default function CardItem({ card, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        background: "#1e1e26",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10, padding: "12px 14px",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.4 : 1,
        transform: CSS.Transform.toString(transform),
        transition, userSelect: "none",
        position: "relative"
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 500, color: "#e8e8f0", lineHeight: 1.5, marginBottom: 4 }}>
        {card.title}
      </div>
      {card.description && (
        <div style={{ fontSize: 12, color: "#9090a8", lineHeight: 1.5, marginBottom: 8 }}>
          {card.description}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {(card.tags || []).map((t: string) => (
            <span key={t} style={{
              fontSize: 10, fontWeight: 500, padding: "2px 7px",
              borderRadius: 20, fontFamily: "monospace",
              ...TAG_STYLES[t]
            }}>{TAG_NAMES[t]}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onEdit(); }}
            style={{
              width: 22, height: 22, borderRadius: 5, border: "none",
              background: "#25252f", color: "#9090a8", cursor: "pointer",
              fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center"
            }}>✎</button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete(); }}
            style={{
              width: 22, height: 22, borderRadius: 5, border: "none",
              background: "#25252f", color: "#9090a8", cursor: "pointer",
              fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center"
            }}>✕</button>
        </div>
      </div>
    </div>
  );
}