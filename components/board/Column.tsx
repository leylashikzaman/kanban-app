"use client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import CardItem from "./CardItem";

export default function Column({ column, cards, onAddCard, onEditCard, onDeleteCard, onRenameColumn, onDeleteColumn }: any) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div style={{
      width: 280, minWidth: 280,
      background: isOver ? "#1e1e26" : "#17171d",
      border: `1px solid ${isOver ? "#6c63ff" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 16, display: "flex", flexDirection: "column",
      maxHeight: "calc(100vh - 160px)",
      boxShadow: isOver ? "0 0 0 2px #6c63ff" : "none",
      transition: "all 0.15s"
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 12px", display: "flex", alignItems: "center",
        gap: 8, borderBottom: "1px solid rgba(255,255,255,0.07)"
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: column.color, flexShrink: 0 }} />
        <input
          defaultValue={column.title}
          onBlur={e => onRenameColumn(column.id, e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          style={{
            flex: 1, background: "transparent", border: "none",
            color: "#e8e8f0", fontSize: 13, fontWeight: 600,
            outline: "none", fontFamily: "inherit", cursor: "text"
          }}
        />
        <span style={{
          fontSize: 11, color: "#5a5a72", background: "#1e1e26",
          padding: "1px 7px", borderRadius: 20, fontFamily: "monospace"
        }}>{cards.length}</span>
        <button onClick={() => onDeleteColumn(column.id)} style={{
          width: 22, height: 22, borderRadius: 6, border: "none",
          background: "transparent", color: "#5a5a72", cursor: "pointer",
          fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center"
        }}>✕</button>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} style={{
        padding: 10, display: "flex", flexDirection: "column",
        gap: 8, overflowY: "auto", flex: 1, minHeight: 40
      }}>
        <SortableContext items={cards.map((c: any) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card: any) => (
            <CardItem
              key={card.id} card={card}
              onEdit={() => onEditCard(card)}
              onDelete={() => onDeleteCard(card.id)}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add card */}
      <div style={{ padding: "8px 10px 12px" }}>
        <button onClick={onAddCard} style={{
          width: "100%", padding: "8px 12px",
          border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 8,
          background: "transparent", color: "#5a5a72", fontSize: 12,
          fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6
        }}>＋ Kart ekle</button>
      </div>
    </div>
  );
}