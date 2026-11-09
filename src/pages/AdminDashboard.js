import { useState, useEffect } from "react";
import { getAdminStats, getSubscriptions, getProducts } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ todayDeliveries: 0, failedPayments: 0, totalSubs: 0, lowStock: [] });
  const [subs, setSubs] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterArea, setFilterArea] = useState("All");

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data)).catch(() => {});
    getSubscriptions().then(res => setSubs(res.data)).catch(() => {});
    getProducts().then(res => setProducts(res.data)).catch(() => {});
  }, []);

  const areas = ["All", ...new Set(subs.map(s => (s.area || "").trim()).filter(a => a !== ""))];
  const filteredSubs = filterArea === "All" ? subs : subs.filter(s => (s.area || "").trim() === filterArea);

  const activeSubs = subs.filter(s => s.status === "active").length;
  const pausedSubs = subs.filter(s => s.status === "paused").length;
  const totalRevenue = subs.reduce((sum, s) => sum + (s.total || 0), 0);

  const getSafeSlot = (slot) => {
    if (!slot || slot.includes("00:00")) return "06:00 - 08:00";
    return slot;
  };

  const getSafeId = (s, idx) => {
    const id = s._id || s.id || `temp-${idx}`;
    return String(id).slice(-6);
  };

  const cardBase = { flex: "1 1 210px", minWidth: 210, padding: 16, borderRadius: 18, boxSizing: "border-box" };
  const labelStyle = { fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#78716c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const valueStyle = { fontSize: 26, fontWeight: 800, marginTop: 6, whiteSpace: "nowrap" };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto", boxSizing: "border-box", overflowX: "hidden" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Panel</h2>
          <p style={{ color: "#78716c", margin: "4px 0 0" }}>FreshNest • Tomorrow's operations • Bangalore</p>
        </div>
        <span style={{ background: "#FFE4E6", color: "#E11D48", padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 800 }}>● LIVE • {subs.length} SUBSCRIPTIONS</span>
      </div>

      {/* STATS */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
        <div style={{ ...cardBase, background: "linear-gradient(135deg,#1A1A2E,#FF4D6D)", color: "#fff" }}>
          <div style={{ ...labelStyle, color: "#fff", opacity: 0.85 }}>TODAY'S DELIVERIES</div>
          <div style={valueStyle}>📦 {stats.todayDeliveries}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Tomorrow: {subs.length} scheduled</div>
        </div>

        <div style={{ ...cardBase, background: "#fff", border: "1px solid #FFE4E6", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
          <div style={labelStyle}>TOTAL SUBSCRIPTIONS</div>
          <div style={{ ...valueStyle, color: "#1A1A2E" }}>{stats.totalSubs || subs.length}</div>
          <div style={{ fontSize: 11, color: "#78716c" }}>{activeSubs} Active • {pausedSubs} Paused</div>
        </div>

        <div style={{ ...cardBase, background: "#fff", border: "1px solid #FFE4E6", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
          <div style={labelStyle}>TOTAL REVENUE</div>
          <div style={{ ...valueStyle, color: "#FF8A00" }}>₹{totalRevenue}</div>
          <div style={{ fontSize: 11, color: "#78716c" }}>From all subscriptions</div>
        </div>

        <div style={{ ...cardBase, background: stats.failedPayments > 0 ? "#FFF1F2" : "#FFFBEB", border: "1px solid #FFE4E6", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
          <div style={labelStyle}>FAILED PAYMENTS</div>
          <div style={{ ...valueStyle, color: stats.failedPayments > 0 ? "#DC2626" : "#44403c" }}>{stats.failedPayments}</div>
          <div style={{ fontSize: 11, color: "#78716c" }}>{stats.failedPayments > 0 ? "⚠️ Needs attention" : "✅ All payments OK"}</div>
        </div>
      </div>

      {/* LOW STOCK ALERT */}
      {stats.lowStock?.length > 0 ? (
        <div style={{ marginTop: 16, background: "#FEF3C7", border: "1px solid #FDE68A", padding: "12px 16px", borderRadius: 14, fontSize: 14 }}>
          <b>⚠️ Low Stock Alert:</b> {stats.lowStock.map(p => p.name).join(", ")} - Restock before 9 PM cutoff!
        </div>
      ) : (
        <div style={{ marginTop: 16, background: "#FFFBEB", padding: "12px 16px", borderRadius: 14, fontSize: 14 }}>✅ Inventory healthy - No low stock items</div>
      )}

      {/* ADMIN NOTIFICATIONS*/}
      <div style={{ marginTop: 16, background: "#fff", border: "1px solid #FFE4E6", padding: "12px 16px", borderRadius: 14, fontSize: 14 }}>
        <b>🔔 Admin Notifications</b>
        <p style={{ margin: "6px 0 0", color: "#57534e" }}>• {pausedSubs} subscriptions paused • {stats.failedPayments} failed payments • {stats.lowStock?.length || 0} items low stock</p>
        {subs.some(s => s.substitutePreference && s.substitutePreference !== "Allow Substitute") && <p style={{ margin: "4px 0 0", color: "#57534e" }}>• Some customers asked for Skip / Call Me on substitute</p>}
      </div>

      {/* ROUTES */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Delivery Routes - Tomorrow {getSafeSlot(subs[0]?.slot)}</h3>
        <select value={filterArea} onChange={e => setFilterArea(e.target.value)} style={{ padding: "8px 12px", borderRadius: 10, border: "2px solid #FFE4E6", fontWeight: 700 }}>
          {areas.map(a => <option key={a} value={a}>{a === "All" ? "All Areas" : a}</option>)}
        </select>
      </div>

      {filteredSubs.length === 0 ? (
        <div style={{ background: "#fff", padding: 28, borderRadius: 18, textAlign: "center", border: "1px dashed #FECDD3", marginTop: 12 }}>
          <div style={{ fontSize: 40 }}>📦</div>
          <b>No deliveries for this area yet</b>
          <p style={{ color: "#78716c", fontSize: 13 }}>Create a subscription from Subscribe page - it will appear here instantly.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 18, overflowX: "auto", border: "1px solid #FFE4E6", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr style={{ background: "#1A1A2E", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: "12px 16px" }}>Area</th>
                <th style={{ padding: "12px 16px" }}>Items</th>
                <th style={{ padding: "12px 16px" }}>Freq / Slot</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((s, idx) => (
                <tr key={s._id || s.id || idx} style={{ borderBottom: "1px solid #FFF1F2", background: idx % 2 === 0 ? "#fff" : "#FFFBEB" }}>
                  <td style={{ padding: "12px 16px" }}><b>📍 {(s.area || "").trim() || "HSR Layout"}</b><div style={{ fontSize: 12, color: "#78716c" }}>#{getSafeId(s, idx)}</div></td>
                  <td style={{ padding: "12px 16px" }}>{(s.items || []).map(i => `${i.name} x${i.qty}`).join(", ")}</td>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>{s.frequency} • {getSafeSlot(s.slot)} {s.substitutePreference ? `• ${s.substitutePreference}` : ""}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", background: s.status === "active" ? "#FFE4E6" : s.status === "paused" ? "#FEF3C7" : "#FEE2E2", color: s.status === "active" ? "#E11D48" : s.status === "paused" ? "#92400E" : "#DC2626" }}>
                      {(s.status || "active").toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 800 }}>₹{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* INVENTORY */}
      <h3 style={{ marginTop: 28 }}>Inventory</h3>
      <div style={{ background: "#fff", borderRadius: 18, overflowX: "auto", border: "1px solid #FFE4E6" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
          <thead>
            <tr style={{ background: "#1A1A2E", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px 16px" }}>Product</th>
              <th style={{ padding: "12px 16px" }}>Stock</th>
              <th style={{ padding: "12px 16px" }}>Price</th>
              <th style={{ padding: "12px 16px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, idx) => (
              <tr key={p._id || p.id || idx} style={{ borderBottom: "1px solid #FFF1F2", background: idx % 2 === 0 ? "#fff" : "#FFFBEB" }}>
                <td style={{ padding: "12px 16px" }}><span style={{ fontSize: 20, marginRight: 8 }}>{p.emoji || p.img || "🥬"}</span><b>{p.name}</b></td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: p.stock < 40 ? "#DC2626" : "#44403c" }}>{p.stock}</td>
                <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>₹{p.price} <s style={{ color: "#a8a29e" }}>₹{p.mrp}</s></td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800, whiteSpace: "nowrap", background: p.stock < 40 ? "#FEE2E2" : "#FFE4E6", color: p.stock < 40 ? "#DC2626" : "#E11D48" }}>
                    {p.stock < 40 ? "⚠️ LOW STOCK" : "✅ IN STOCK"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ textAlign: "center", color: "#a8a29e", fontSize: 12, marginTop: 20 }}>FreshNest Admin • Data from MongoDB • Updated live</p>
    </div>
  );
}