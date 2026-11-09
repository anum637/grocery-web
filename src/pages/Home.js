import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data)).catch(() => {});
  }, []);

  const cats = ["All", "Dairy", "Bakery", "Vegetables", "Fruits", "Beverages"];

  const filtered = products.filter((p) => {
    const matchCat = cat === "All" || p.category === cat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #FF4D6D 60%, #FF8A00 100%)",
        borderRadius: 24, padding: "36px 28px", color: "#fff",
        display: "flex", gap: 24, alignItems: "center",
        flexWrap: "wrap", justifyContent: "space-between",
        overflow: "hidden", position: "relative"
      }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <span style={{
            background: "rgba(255,255,255,0.22)", padding: "6px 12px",
            borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: 1
          }}>● LIVE IN BANGALORE • 6 AM DELIVERY</span>

          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.05, marginTop: 16, letterSpacing: -1 }}>
            Fresh from Farm<br />in <span style={{ color: "#FFC300" }}>30 mins.</span>
          </h1>

          <p style={{ color: "#FFE4E6", margin: "14px 0 22px", fontSize: 16, lineHeight: 1.6, maxWidth: 480 }}>
            Milk, Bread, Veggies & Fruits - delivered every morning.
            Subscribe once, never run out again. Save 20% on daily plans.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/subscribe">
              <button style={{ background: "#FFC300", color: "#1c1917", border: "none", padding: "13px 24px", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "none" }}>
                Subscribe Now →
              </button>
            </Link>
            <a href="#products">
              <button style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", padding: "13px 22px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "none" }}>
                Browse Products
              </button>
            </a>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 22, fontSize: 13, fontWeight: 700 }}>
            <span>⭐ 4.9 Rating</span>
            <span>🚀 500+ Happy Homes</span>
            <span>🥬 100% Fresh</span>
          </div>
        </div>

        {/* Right visual */}
        <div style={{
          background: "rgba(255,255,255,0.14)", borderRadius: 20,
          padding: "22px 18px", textAlign: "center", minWidth: 220, flex: "0 0 240px"
        }}>
          <div style={{ fontSize: 78, lineHeight: 1 }}>🥛🍞🥬</div>
          <div style={{ background: "#fff", color: "#1c1917", borderRadius: 12, padding: "10px", marginTop: 14, fontSize: 13, fontWeight: 700 }}>
            Today's Deal<br />
            <span style={{ color: "#FF4D6D", fontSize: 18 }}>Milk + Bread = ₹76</span><br />
            <span style={{ color: "#78716c", textDecoration: "line-through", fontWeight: 500 }}>₹95</span> • Save 20%
          </div>
          <div style={{ fontSize: 12, marginTop: 10, opacity: 0.9 }}>⏰ Next delivery: Tomorrow 6 AM</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "20px 0" }}>
        {[
          ["🚚", "Free Delivery", "On orders above ₹199"],
          ["🔁", "Pause Anytime", "Skip a day in 1 click"],
          ["💳", "Pay Online", "UPI, Card, Cash"],
          ["🌱", "Farm Fresh", "Sourced daily 5 AM"],
        ].map(([emoji, title, sub]) => (
          <div key={title} style={{ flex: "1 1 160px", background: "#fff", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 28 }}>{emoji}</span>
            <div><div style={{ fontWeight: 800, fontSize: 14 }}>{title}</div><div style={{ fontSize: 12, color: "#78716c" }}>{sub}</div></div>
          </div>
        ))}
      </div>

      {/* ===== SEARCH + CATEGORIES ===== */}
      <h2 id="products" style={{ marginTop: 8 }}>Shop Fresh Today</h2>
      <input
        placeholder="🔍 Search Milk, Bread, Tomato..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginTop: 14 }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0 18px" }}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              background: cat === c ? "#1A1A2E" : "#fff",
              color: cat === c ? "#fff" : "#44403c",
              border: cat === c ? "none" : "1px solid #e7e5e4",
              padding: "9px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", boxShadow: "none"
            }}
          >{c}</button>
        ))}
      </div>

      {/* ===== PRODUCTS ===== */}
      {filtered.length === 0 ? (
        <p>No products found. Try another search.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 }}>
          {filtered.map((p) => (
            <div key={p._id} style={{ background: "#fff", borderRadius: 20, padding: 14, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 56, background: "linear-gradient(180deg,#FFF1F2,#FFFBEB)", borderRadius: 14, padding: "16px 0", textAlign: "center" }}>
                {p.emoji || "🥬"}
              </div>
              <b style={{ display: "block", marginTop: 10 }}>{p.name}</b>
              <div style={{ fontSize: 13, color: "#78716c" }}>{p.category} • {p.unit || "1 pc"}</div>
              <div style={{ margin: "8px 0" }}>
                <b style={{ fontSize: 17 }}>₹{p.price}</b>
                {p.mrp && <s style={{ color: "#a8a29e", fontSize: 13, marginLeft: 6 }}>₹{p.mrp}</s>}
                {p.stock < 20 && <span style={{ background: "#FEF3C7", color: "#92400e", fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 999, marginLeft: 8 }}>LOW STOCK</span>}
              </div>
              <Link to={`/subscribe?product=${p._id}`}>
                <button style={{ width: "100%" }}>Subscribe →</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}