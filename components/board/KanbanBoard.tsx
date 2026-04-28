"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  DndContext, DragEndEvent, DragOverEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import Column from "./Column";
import CardModal from "./CardModal";

const COLORS = ["#6c63ff","#3ecf8e","#f5a623","#ff6b6b","#60a5fa","#f472b6"];

export default function KanbanBoard({ userId }: { userId: string }) {
  const supabase = createClient();
  const [boards, setBoards] = useState<any[]>([]);
  const [currentBoard, setCurrentBoard] = useState<any>(null);
  const [columns, setColumns] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCard, setEditCard] = useState<any>(null);
  const [addToCol, setAddToCol] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [showNewBoard, setShowNewBoard] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => { loadBoards(); }, []);
  useEffect(() => { if (currentBoard) { loadColumns(); } }, [currentBoard]);

  async function loadBoards() {
    const { data } = await supabase.from("boards").select("*").order("created_at");
    if (data && data.length > 0) {
      setBoards(data);
      setCurrentBoard(data[0]);
    } else {
      setBoards([]);
    }
  }

  async function loadColumns() {
    const { data: cols } = await supabase
      .from("columns").select("*")
      .eq("board_id", currentBoard.id).order("position");
    const { data: cds } = await supabase
      .from("cards").select("*")
      .in("column_id", (cols || []).map((c: any) => c.id)).order("position");
    setColumns(cols || []);
    setCards(cds || []);
  }

  async function createBoard() {
    if (!newBoardName.trim()) return;
    const { data } = await supabase.from("boards")
      .insert({ name: newBoardName.trim(), user_id: userId }).select().single();
    if (data) {
      await supabase.from("columns").insert([
        { board_id: data.id, title: "Yapılacak", color: "#6c63ff", position: 0 },
        { board_id: data.id, title: "Devam Ediyor", color: "#f5a623", position: 1 },
        { board_id: data.id, title: "Tamamlandı", color: "#3ecf8e", position: 2 },
      ]);
      setNewBoardName("");
      setShowNewBoard(false);
      await loadBoards();
      setCurrentBoard(data);
    }
  }

  async function addColumn() {
    const color = COLORS[columns.length % COLORS.length];
    const { data } = await supabase.from("columns")
      .insert({ board_id: currentBoard.id, title: "Yeni Sütun", color, position: columns.length })
      .select().single();
    if (data) setColumns([...columns, data]);
  }

  async function updateColumn(id: string, title: string) {
    await supabase.from("columns").update({ title }).eq("id", id);
    setColumns(columns.map(c => c.id === id ? { ...c, title } : c));
  }

  async function deleteColumn(id: string) {
    if (!confirm("Bu sütun silinsin mi?")) return;
    await supabase.from("columns").delete().eq("id", id);
    setColumns(columns.filter(c => c.id !== id));
    setCards(cards.filter(c => c.column_id !== id));
  }

  async function saveCard(data: any) {
    if (editCard) {
      await supabase.from("cards").update(data).eq("id", editCard.id);
      setCards(cards.map(c => c.id === editCard.id ? { ...c, ...data } : c));
    } else {
      const { data: newCard } = await supabase.from("cards")
        .insert({ ...data, column_id: addToCol, position: cards.filter(c => c.column_id === addToCol).length })
        .select().single();
      if (newCard) setCards([...cards, newCard]);
    }
    setModalOpen(false);
    setEditCard(null);
  }

  async function deleteCard(id: string) {
    await supabase.from("cards").delete().eq("id", id);
    setCards(cards.filter(c => c.id !== id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const cardId = active.id as string;
    const overId = over.id as string;
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    const targetColId = columns.find(c => c.id === overId)
      ? overId
      : cards.find(c => c.id === overId)?.column_id;
    if (!targetColId || targetColId === card.column_id) return;
    await supabase.from("cards").update({ column_id: targetColId }).eq("id", cardId);
    setCards(cards.map(c => c.id === cardId ? { ...c, column_id: targetColId } : c));
  }

  if (!currentBoard && boards.length === 0) return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16
    }}>
      <div style={{ fontSize: 40 }}>📋</div>
      <div style={{ color: "#9090a8", fontSize: 14 }}>Henüz board yok</div>
      <button onClick={() => setShowNewBoard(true)} style={{
        background: "#6c63ff", color: "#fff", border: "none",
        borderRadius: 8, padding: "10px 20px", fontSize: 13,
        fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
      }}>İlk Board'u Oluştur</button>
      {showNewBoard && (
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newBoardName} onChange={e => setNewBoardName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && createBoard()}
            placeholder="Board adı..." autoFocus
            style={{
              background: "#1e1e26", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8, color: "#e8e8f0", padding: "9px 14px",
              fontSize: 13, outline: "none", fontFamily: "inherit"
            }} />
          <button onClick={createBoard} style={{
            background: "#6c63ff", color: "#fff", border: "none",
            borderRadius: 8, padding: "9px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit"
          }}>Oluştur</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Board tabs */}
      <div style={{
        padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex", gap: 4, alignItems: "center", background: "#17171d"
      }}>
        {boards.map(b => (
          <button key={b.id} onClick={() => setCurrentBoard(b)} style={{
            padding: "10px 16px", background: "transparent", border: "none",
            borderBottom: currentBoard?.id === b.id ? "2px solid #6c63ff" : "2px solid transparent",
            color: currentBoard?.id === b.id ? "#e8e8f0" : "#9090a8",
            fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit"
          }}>{b.name}</button>
        ))}
        {showNewBoard ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "6px 0" }}>
            <input value={newBoardName} onChange={e => setNewBoardName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") createBoard(); if (e.key === "Escape") setShowNewBoard(false); }}
              placeholder="Board adı..." autoFocus
              style={{
                background: "#1e1e26", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, color: "#e8e8f0", padding: "5px 10px",
                fontSize: 12, outline: "none", fontFamily: "inherit", width: 140
              }} />
            <button onClick={createBoard} style={{
              background: "#6c63ff", color: "#fff", border: "none",
              borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit"
            }}>+</button>
            <button onClick={() => setShowNewBoard(false)} style={{
              background: "transparent", border: "none", color: "#9090a8",
              fontSize: 14, cursor: "pointer"
            }}>✕</button>
          </div>
        ) : (
          <button onClick={() => setShowNewBoard(true)} style={{
            padding: "10px 12px", background: "transparent", border: "none",
            color: "#5a5a72", fontSize: 13, cursor: "pointer", fontFamily: "inherit"
          }}>+ Yeni</button>
        )}
      </div>

      {/* Columns */}
      <div style={{
        flex: 1, overflowX: "auto", overflowY: "hidden",
        padding: 24, display: "flex", gap: 16, alignItems: "flex-start"
      }}>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
            {columns.map(col => (
              <Column
                key={col.id} column={col}
                cards={cards.filter(c => c.column_id === col.id)}
                onAddCard={() => { setAddToCol(col.id); setEditCard(null); setModalOpen(true); }}
                onEditCard={(card:any) => { setEditCard(card); setModalOpen(true); }}
                onDeleteCard={deleteCard}
                onRenameColumn={updateColumn}
                onDeleteColumn={deleteColumn}
              />
            ))}
          </SortableContext>
        </DndContext>
        <button onClick={addColumn} style={{
          width: 260, minWidth: 260, background: "transparent",
          border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 16,
          padding: "18px 20px", color: "#5a5a72", fontSize: 13,
          fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          alignSelf: "flex-start", transition: "all 0.15s"
        }}>＋ Sütun ekle</button>
      </div>

      {modalOpen && (
        <CardModal
          card={editCard}
          onSave={saveCard}
          onClose={() => { setModalOpen(false); setEditCard(null); }}
        />
      )}
    </div>
  );
}
