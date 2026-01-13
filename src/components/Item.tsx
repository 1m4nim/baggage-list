import React, { useState, useMemo } from "react";

// 型定義
type Category = "貴重品" | "衣類" | "ガジェット" | "その他";
const CATEGORIES: Category[] = ["貴重品", "衣類", "ガジェット", "その他"];

interface PackingItem {
  id: string;
  name: string;
  category: Category;
  isPacked: boolean;
  quantity: number;
}

// 名前を Item にしてエクスポート
export function Item() {
  const [items, setItems] = useState<PackingItem[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("その他");
  const [filter, setFilter] = useState<Category | "すべて">("すべて");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newItem: PackingItem = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      category,
      isPacked: false,
      quantity: 1,
    };
    setItems((prev) => [...prev, newItem]);
    setName("");
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isPacked: !i.isPacked } : i))
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filteredItems = useMemo(() => {
    return items.filter((i) =>
      filter === "すべて" ? true : i.category === filter
    );
  }, [items, filter]);

  return (
    <div style={{ padding: "20px", textAlign: "left" }}>
      <h1>持ち物リスト</h1>
      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: "20px", display: "flex", gap: "10px" }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="持ち物名"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit">追加</button>
      </form>

      <div style={{ marginBottom: "10px" }}>
        {["すべて", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(category)}
            style={{
              color: "black",
              marginRight: "5px",
              backgroundColor: filter === c ? "#f3aa57ff" : "bisque",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <ul>
        {filteredItems.map((item) => (
          <li key={item.id} style={{ marginBottom: "5px" }}>
            <input
              type="checkbox"
              checked={item.isPacked}
              onChange={() => toggleItem(item.id)}
            />
            <span
              style={{
                textDecoration: item.isPacked ? "line-through" : "none",
                margin: "0 10px",
              }}
            >
              [{item.category}] {item.name}
            </span>
            <button onClick={() => deleteItem(item.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
