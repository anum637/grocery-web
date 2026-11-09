import { useState, useEffect } from "react";
import { getMySubscriptions } from "../services/api";
import axios from "axios";
import { useSubs } from "../context/SubscriptionContext";
import { SLOTS } from "../data/products";

const API_BASE = process.env.REACT_APP_API_URL || "http://10.0.2.2:5000";
export default function MySubscriptions() {
  const { wallet, loyalty } = useSubs();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    "✅ Welcome to FreshNest! Your deliveries are on track."
  ]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newSlot, setNewSlot] = useState("06:00 - 08:00");

  const fetchSubs = () => {
    getMySubscriptions()
      .then(res => setSubscriptions(res.data))
      .catch(() => console.log("Backend not running"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubs(); }, []);

  const getSafeId = (s) => {
    const id = s._id || s.id || "000000";
    return String(id).slice(-6);
  };
  const getSafeSlot = (slot) => {
    if (!slot || slot.includes("00:00")) return "06:00 - 08:00";
    return slot;
  };
  const getSafeItems = (s) => (s.items || []).map(i => `${i.name} x${i.qty}`).join(" • ");

  const addNotification = (msg) => setNotifications(prev => [msg, ...prev].slice(0, 5));

  const updateStatus = async (id, status) => {
    if (status === "cancelled" && !window.confirm("Are you sure you want to cancel this subscription?")) return;
    try { 
      await axios.put(`${API_BASE}/api/subscriptions/${id}`, { status }); 
    } catch (e) { console.log("Backend not reachable, updating locally"); }
    setSubscriptions(prev => prev.map(s => (s._id === id || s.id === id) ? { ...s, status } : s));
    if (status === "paused") addNotification("⏸ Subscription paused. No delivery tomorrow.");
    if (status === "active") addNotification("▶ Subscription resumed. Delivery tomorrow 7 AM.");
    if (status === "cancelled") addNotification("✕ Subscription cancelled. Wallet refund in 3-5 days.");
  };

  const skipTomorrow = async (id) => {
    try { await axios.put(`${API_BASE}/api/subscriptions/${id}/skip`); } catch (e) {}
    setSubscriptions(prev => {
      const target = prev.find(s => s._id === id || s.id === id);
      if (target && !target.skipped) addNotification(`⏭ Skipped: ${target.items?.[0]?.name || "Delivery"} for Tomorrow`);
      if (target && target.skipped) addNotification(`↩ Undo Skip - Delivery restored for Tomorrow`);
      return prev.map(s => (s._id === id || s.id === id) ? { ...s, skipped: !s.skipped } : s);
    });
  };

  const reschedule = async (id, slotToUse) => {
    if (!slotToUse || slotToUse.includes("00:00")) return alert("Select a valid slot");
    try { await axios.put(`${API_BASE}/api/subscriptions/${id}`, { slot: slotToUse }); } catch (e) {}
    setSubscriptions(prev => prev.map(s => (s._id === id || s.id === id) ? { ...s, slot: slotToUse } : s));
    addNotification(`🕒 Rescheduled to ${slotToUse}`);
    setRescheduleId(null);
  };

  if (loading) return <div style={{ padding: 20, textAlign: "center" }}>Loading your subscriptions...</div>;

  const activeCount = subscriptions.filter(s => s.status === "active").length;
  const pausedCount = subscriptions.filter(s => s.status === "paused").length;

  const getStatusStyle = (status) => {
    if (status === "active") return { bg: "#FFE4E6", color: "#E11D48", label: "● ACTIVE" };
    if (status === "paused") return { bg: "#FEF3C7", color: "#92400E", label: "⏸ PAUSED" };
    return { bg: "#FEE2E2", color: "#DC2626", label: "✕ CANCELLED" };
  };

  return (
    <div style={{ padding: 20, maxWidth: 860, margin: "0 auto" }}>
      {/* HEADER */}
      <h2 style={{ marginBottom: 4 }}>My Dashboard</h2>
      <p style={{ color: "#78716c", marginBottom: 18 }}>Manage your daily fresh deliveries in one place</p>

      {/* WALLET STRIP */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
        <div style={{ flex: "1 1 160px", background: "linear-gradient(135deg,#1A1A2E,#FF4D6D)", color: "#fff", padding: 18, borderRadius: 18 }}>
          <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 700, letterSpacing: 1 }}>WALLET BALANCE</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>₹{wallet}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>+ ₹20 cashback on next order</div>
          {wallet < 100 && <div style={{ fontSize: 12, background: "#FEF3C7", color: "#92400E", padding: "4px 8px", borderRadius: 8, marginTop: 8, fontWeight: 700 }}>⚠️ Low Balance - Recharge soon</div>}
        </div>
        <div style={{ flex: "1 1 160px", background: "#fff", padding: 18, borderRadius: 18, boxShadow: "0 4px 14px rgba(0,0,0,0.04)", border: "1px solid #FFE4E6" }}>
          <div style={{ fontSize: 12, color: "#78716c", fontWeight: 700, letterSpacing: 1 }}>LOYALTY POINTS</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#FF8A00" }}>⭐ {loyalty} pts</div>
          <div style={{ fontSize: 12, color: "#78716c" }}>100 pts = ₹10 off</div>
        </div>
        <div style={{ flex: "1 1 160px", background: "#fff", padding: 18, borderRadius: 18, boxShadow: "0 4px 14px rgba(0,0,0,0.04)", border: "1px solid #FFE4E6" }}>
          <div style={{ fontSize: 12, color: "#78716c", fontWeight: 700, letterSpacing: 1 }}>SUBSCRIPTIONS</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{activeCount} Active <span style={{ fontSize: 14, color: "#78716c" }}>• {pausedCount} Paused</span></div>
          <div style={{ fontSize: 12, color: "#78716c" }}>{subscriptions.length} total from MongoDB</div>
        </div>
      </div>

      <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: "14px 16px", borderRadius: 14, marginBottom: 18 }}>
        <b>🔔 Notifications</b>
        {notifications.map((n, i) => <p key={i} style={{ margin: "6px 0 0", fontSize: 14, color: "#57534e" }}>• {n}</p>)}
      </div>

      <h3 style={{ marginBottom: 12 }}>Upcoming Deliveries</h3>

      {subscriptions.length === 0 && (
        <div style={{ background: "#fff", padding: 28, borderRadius: 18, textAlign: "center", border: "1px dashed #FECDD3" }}>
          <div style={{ fontSize: 48 }}>🥛</div>
          <b style={{ display: "block", marginTop: 8 }}>No subscriptions yet</b>
          <p style={{ color: "#78716c", fontSize: 14, margin: "6px 0 14px" }}>Start your first daily delivery - Milk, Bread & more in 30 mins.</p>
          <a href="/subscribe"><button>Subscribe Now →</button></a>
        </div>
      )}

      {subscriptions.map((s, idx) => {
        const st = getStatusStyle(s.status);
        const sid = s._id || s.id || idx;
        return (
          <div key={sid} style={{ border: "1px solid #FFE4E6", padding: 18, borderRadius: 18, marginBottom: 14, background: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.04)", opacity: s.status === "cancelled" ? 0.6 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div>
                <b style={{ fontSize: 16 }}>#{getSafeId(s)} • {(s.frequency || "daily").toUpperCase()} • {getSafeSlot(s.slot)}</b>
                <div style={{ marginTop: 6, fontSize: 14, color: "#44403c" }}>{getSafeItems(s)}</div>
                {s.customDays && s.customDays.length > 0 && <div style={{ fontSize: 13, color: "#78716c", marginTop: 2 }}>Custom Days: {s.customDays.join(", ")}</div>}
                {s.area && <div style={{ fontSize: 13, color: "#78716c" }}>📍 {s.area}</div>}
                {s.substitutePreference && <div style={{ fontSize: 13, color: "#78716c" }}>🔄 Substitute: {s.substitutePreference}</div>}
              </div>
              <span style={{ background: st.bg, color: st.color, padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>{st.label}</span>
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "12px 0", padding: "12px", background: "#FFFBEB", borderRadius: 12, fontSize: 13 }}>
              <span>📅 Next: <b>{s.nextDelivery || "Tomorrow, 7 AM"}</b> {s.skipped ? <span style={{ background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>Skipped Tomorrow</span> : ""}</span>
              <span>💰 Total: <b>₹{s.total}</b></span>
              <span>💳 {s.payment || "wallet"}</span>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => updateStatus(sid, s.status === "paused" ? "active" : "paused")}
                disabled={s.status === "cancelled"}
                style={{ padding: "9px 16px", borderRadius: 10, cursor: "pointer", background: s.status === "paused" ? "#1A1A2E" : "#FF8A00", color: "#fff", border: 0, fontWeight: 700, fontSize: 13, opacity: s.status === "cancelled" ? 0.5 : 1 }}
              >{s.status === "paused" ? "▶ Resume" : "⏸ Pause"}</button>

              <button
                onClick={() => skipTomorrow(sid)}
                disabled={s.status === "cancelled"}
                style={{ padding: "9px 16px", borderRadius: 10, cursor: "pointer", background: s.skipped ? "#1A1A2E" : "#fff", color: s.skipped ? "#fff" : "#44403c", border: "1px solid #e7e5e4", fontWeight: 700, fontSize: 13 }}
              >{s.skipped ? "↩ Undo Skip" : "⏭ Skip Tomorrow"}</button>

              {rescheduleId === sid ? (
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <select value={newSlot} onChange={e => setNewSlot(e.target.value)} style={{ padding: "8px", borderRadius: 10, border: "1px solid #e7e5e4" }}>
                    {SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                  </select>
                  <button onClick={() => reschedule(sid, newSlot)} style={{ padding: "9px 12px", borderRadius: 10, background: "#1A1A2E", color: "#fff", border: 0, fontWeight: 700 }}>Save</button>
                  <button onClick={() => setRescheduleId(null)} style={{ padding: "9px 12px", borderRadius: 10, background: "#fff", border: "1px solid #e7e5e4" }}>X</button>
                </span>
              ) : (
                <button
                  onClick={() => { setRescheduleId(sid); setNewSlot(getSafeSlot(s.slot)); }}
                  disabled={s.status === "cancelled"}
                  style={{ padding: "9px 16px", borderRadius: 10, cursor: "pointer", background: "#fff", color: "#44403c", border: "1px solid #e7e5e4", fontWeight: 700, fontSize: 13 }}
                >🕒 Reschedule</button>
              )}

              <button
                onClick={() => updateStatus(sid, "cancelled")}
                disabled={s.status === "cancelled"}
                style={{ padding: "9px 16px", borderRadius: 10, cursor: "pointer", background: "#FFF1F2", color: "#DC2626", border: 0, fontWeight: 700, fontSize: 13, marginLeft: "auto", opacity: s.status === "cancelled" ? 0.5 : 1 }}
              >✕ Cancel</button>
            </div>
          </div>
        );
      })}

      <h3 style={{ marginTop: 22 }}>Order History</h3>
      <div style={{ background: "#fff", padding: 16, borderRadius: 14, border: "1px solid #FFE4E6", fontSize: 14, color: "#57534e" }}>
        {subscriptions.length === 0 ? "No past orders yet." : `✅ ${subscriptions.length} subscriptions saved in MongoDB • ${activeCount} active, ${pausedCount} paused`}
      </div>
    </div>
  );
}