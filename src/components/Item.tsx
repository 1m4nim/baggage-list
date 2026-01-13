import React, { useState, useMemo, useEffect } from "react";

// --- 型定義 ---
type Category = "貴重品" | "衣類" | "ガジェット" | "その他";
const CATEGORIES: Category[] = ["貴重品", "衣類", "ガジェット", "その他"];

interface PackingItem {
  id: string;
  name: string;
  category: Category;
  isPacked: boolean;
  quantity: number;
}

interface Templates {
  [key: string]: PackingItem[];
}

const INITIAL_TEMPLATES: Templates = {
  "キャンプ": [
    { id: "c1", name: "テント", category: "その他", isPacked: false, quantity: 1 },
    { id: "c2", name: "寝袋", category: "衣類", isPacked: false, quantity: 1 },
  ],
  "ジム": [
    { id: "g1", name: "ウェア", category: "衣類", isPacked: false, quantity: 1 },
    { id: "g2", name: "シューズ", category: "衣類", isPacked: false, quantity: 1 },
  ]
};

export function Item() {
  // --- ステート管理 ---
  // 【LocalStorage】初期値の読み込み
  const [templates, setTemplates] = useState<Templates>(() => {
    const saved = localStorage.getItem("my_packing_app_data");
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });

  const [items, setItems] = useState<PackingItem[]>([]);
  const [name, setName] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("その他");
  const [filter, setFilter] = useState<Category | "すべて">("すべて");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("");

  // --- 副作用 ---
  // 【LocalStorage】templatesが更新されるたびに保存
  useEffect(() => {
    localStorage.setItem("my_packing_app_data", JSON.stringify(templates));
  }, [templates]);

  // --- ハンドラー ---

  // ① 新規テンプレート（枠）の作成
  const handleCreateEmptyTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newTemplateName.trim();
    if (!trimmedName) return;
    if (templates[trimmedName]) {
      alert("既に存在します");
      return;
    }
    // テンプレート群を更新（これがuseEffect経由で保存される）
    setTemplates(prev => ({ ...prev, [trimmedName]: [] }));
    setSelectedTemplateKey(trimmedName);
    setItems([]);
    setNewTemplateName("");
  };

  // ② テンプレート選択
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedTemplateKey(selected);
    if (selected && templates[selected]) {
      setItems([...templates[selected]]);
    }
  };

  // ③ 現在の編集内容を上書き保存
  const handleSaveToCurrentTemplate = () => {
    if (!selectedTemplateKey) return;
    // チェック状態をリセットしてテンプレートへ保存
    const savedItems = items.map(i => ({ ...i, isPacked: false }));
    setTemplates(prev => ({
      ...prev,
      [selectedTemplateKey]: savedItems
    }));
    alert(`「${selectedTemplateKey}」を保存しました！`);
  };

  // アイテムの追加
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newItem: PackingItem = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      category: activeCategory,
      isPacked: false,
      quantity: 1,
    };
    setItems((prev) => [...prev, newItem]);
    setName("");
  };

  // フィルタリング
  const filteredItems = useMemo(() => {
    return items.filter((i) => (filter === "すべて" ? true : i.category === filter));
  }, [items, filter]);

  return (
    <div style={{ padding: "20px", textAlign: "left", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif", backgroundColor: "#b48938ff", minHeight: "100vh" }}>
      <h1 style={{ color: "black", marginBottom: "30px" }}>持ち物リスト管理</h1>

      {/* ① テンプレート名作成 */}
      <div style={{ marginBottom: "20px", backgroundColor: "bisque", padding: "15px", borderRadius: "12px" }}>
        <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "black" }}>① 新しいテンプレート名を作成</p>
        <form onSubmit={handleCreateEmptyTemplate} style={{ display: "flex", gap: "10px" }}>
          <input type="text" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder="ハワイ旅行など" style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
          <button type="submit" style={{ padding: "10px 15px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>作成</button>
        </form>
      </div>

      {/* ② テンプレート選択 */}
      <div style={{ marginBottom: "20px", backgroundColor: "#e0c090", padding: "15px", borderRadius: "12px" }}>
        <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "black" }}>② 編集するテンプレートを選ぶ</p>
        <select value={selectedTemplateKey} onChange={handleTemplateSelect} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}>
          <option value="" disabled>-- 選択してください --</option>
          {Object.keys(templates).map(tName => <option key={tName} value={tName}>{tName}</option>)}
        </select>
      </div>

      {/* ③ 編集エリア */}
      {selectedTemplateKey && (
        <div style={{ marginTop: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ margin: "0" }}>「{selectedTemplateKey}」を編集</h2>
            <button onClick={handleSaveToCurrentTemplate} style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>変更を保存</button>
          </div>

          {/* 追加用フォーム */}
          <div style={{ backgroundColor: "rgba(255,255,255,0.3)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
            <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "bold", color: "black" }}>[追加先カテゴリーを選択]</p>
            <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  style={{
                    flex: 1, padding: "8px 5px", fontSize: "12px", borderRadius: "4px",
                    border: activeCategory === c ? "2px solid black" : "1px solid #ccc",
                    backgroundColor: activeCategory === c ? "#e6d27bff" : "black",
                    color: activeCategory === c ? "black" : "white",
                    fontWeight: activeCategory === c ? "bold" : "normal", cursor: "pointer"
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px" }}>
              <input type="text" style={{ flex: 1, padding: "12px", borderRadius: "4px", border: "none" }} value={name} onChange={(e) => setName(e.target.value)} placeholder={`${activeCategory} を入力して追加...`} />
              <button type="submit" style={{ padding: "10px 20px", backgroundColor: "black", color: "white", borderRadius: "4px", cursor: "pointer" }}>追加</button>
            </form>
          </div>

          {/* 表示切替（フィルター） */}
          <div style={{ marginBottom: "15px" }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>表示を絞り込む：</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["すべて", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c as Category)}
                  style={{
                    padding: "6px 15px", borderRadius: "20px", border: "none",
                    backgroundColor: filter === c ? "#007bff" : "white",
                    color: filter === c ? "white" : "black",
                    cursor: "pointer", fontSize: "14px", fontWeight: "bold"
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* リスト表示 */}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredItems.map((item) => (
              <li key={item.id} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                <input
                  type="checkbox"
                  checked={item.isPacked}
                  onChange={() => setItems(items.map(i => i.id === item.id ? { ...i, isPacked: !i.isPacked } : i))}
                  style={{ width: "22px", height: "22px", cursor: "pointer" }}
                />
                <span style={{ flex: 1, marginLeft: "12px", fontSize: "18px", textDecoration: item.isPacked ? "line-through" : "none", color: item.isPacked ? "#555" : "black" }}>
                  <small style={{ fontWeight: "bold", marginRight: "8px", opacity: 0.7 }}>[{item.category}]</small>
                  {item.name}
                </span>
                <button onClick={() => setItems(items.filter(i => i.id !== item.id))} style={{ color: "#800", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}>削除</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}