import { useState, useEffect } from "react";
import { SLOTS, FREQUENCIES } from "../data/products";
import { useSubs } from "../context/SubscriptionContext";
import { getProducts, createSubscription as createSubAPI } from "../services/api";

export default function CreateSubscription() {
  const { cart, addToCart, createSubscription, wallet } = useSubs();
  const [products, setProducts] = useState([]);
  const [freq, setFreq] = useState("daily");
  const [slot, setSlot] = useState("06:00 - 08:00");
  const [payment, setPayment] = useState("wallet");
  const [customDays, setCustomDays] = useState([]);
  const [area, setArea] = useState("HSR Layout");
  const [substitutePref, setSubstitutePref] = useState("Allow Substitute");
  const [notifications, setNotifications] = useState([]);

    useEffect(() => {
    getProducts().then(res => {
      console.log("PRODUCTS FROM API:", res.data);
      const list = Array.isArray(res.data) ? res.data : (res.data.products || []);
      setProducts(list);
      if (list.length === 0) alert("API returned 0 products. Check backend data.");
    }).catch((err) => {
      alert("API FAILED: " + (err.message || err) + " URL: " + err.config?.baseURL + err.config?.url);
      console.log("API ERROR:", err);
    });
  }, []);

  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const discount = total === 0 ? 0 : Math.round(total * 0.05) + (freq === "weekly" ? 20 : 0);
  const finalTotal = total - discount;

  const handleCreate = async () => {
    if (cart.length === 0) return alert("Please add at least 1 item");
    if (!area || area.trim() === "") return alert("Please enter Delivery Area - It cannot be empty");
    if (freq === "custom" && customDays.length === 0) return alert("Select at least 1 day for Custom plan");
    if (!slot || slot === "00:00 - 00:00") return alert("Please select a valid Delivery Slot");

    // Cutoff check
    const hour = new Date().getHours();
    if (hour >= 21) {
      alert("Cutoff passed (9 PM). Your order will be delivered day after tomorrow.");
    }

    // Wallet check - only for wallet payment
    if (payment === "wallet" && wallet < finalTotal) {
      return alert(`Low Balance! Wallet ₹${wallet} but total is ₹${finalTotal}. Use Card or COD.`);
    }

    const payload = {
      items: cart.map(i => ({ name: i.product.name, qty: i.qty })),
      frequency: freq, slot, payment,
      nextDelivery: "Tomorrow, 7 AM",
      total: finalTotal,
      subtotal: total,
      discount,
      customDays,
      area: area.trim(), 
      allowSubstitute: substitutePref !== "Skip Item",
      substitutePreference: substitutePref, 
      status: "active"
    };
    try {
      await createSubAPI(payload);
      createSubscription(payload);
      setNotifications(prev => [...prev, `Order confirmed for Tomorrow 7 AM - ₹${finalTotal}`]);
      alert("Subscription Created! Saved to MongoDB.");
    } catch (e) {
      alert(e.response?.data?.msg || "Backend error - check if server is running");
    }
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
      <div style={{ flex: 2, minWidth: 300 }}>
        <h2>1. Select Essentials</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginTop: 14 }}>
          {products.map(p => {
            const inCart = cart.find(i => (i.product._id || i.product.id) === p._id);
            return (
              <div key={p._id} style={{ border: "1px solid #FFE4E6", padding: 14, borderRadius: 18, background: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize: 56, background: "linear-gradient(180deg,#FFF1F2,#FFFBEB)", borderRadius: 12, padding: "14px 0", textAlign: "center" }}>
                  {p.emoji}
                </div>
                <b style={{ display: "block", marginTop: 10 }}>{p.name}</b>
                <div style={{ margin: "4px 0" }}>₹{p.price} <s style={{ color: "#a8a29e", fontSize: 13 }}>₹{p.mrp}</s></div>
                <div style={{ fontSize: 12, color: p.stock < 40 ? "#DC2626" : "#78716c", fontWeight: p.stock < 40 ? 700 : 400 }}>
                  {p.stock} in stock {p.stock < 40 ? "• Low" : ""}
                </div>
                <button
                  onClick={() => addToCart(p)}
                  style={{
                    marginTop: 10, width: "100%",
                    background: inCart ? "#1A1A2E" : "linear-gradient(135deg,#FF4D6D,#FF8A00)",
                    color: "#fff", border: 0, padding: "10px", borderRadius: 10,
                    fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 10px rgba(255,77,109,0.25)"
                  }}>
                  {inCart ? `✓ Added (${inCart.qty}) +` : "Add +"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, minWidth: 280, border: "1px solid #FFE4E6", padding: 18, borderRadius: 18, background: "#fff", boxShadow: "0 6px 20px rgba(0,0,0,0.05)", position: "sticky", top: 80 }}>
        <h3 style={{ margin: 0 }}>2. Your Plan</h3>

        <label style={{ display: "block", marginBottom: 4, marginTop: 14, fontWeight: 600, fontSize: 14 }}>Delivery Area *</label>
        <input
          value={area}
          onChange={e => setArea(e.target.value)}
          placeholder="e.g. HSR Layout, Koramangala, Bellandur"
          style={{ padding: 11, width: "100%", borderRadius: 12, border: "2px solid #FFE4E6", marginBottom: 12, boxSizing: "border-box", outline: "none" }}
        />

        <label style={{ fontWeight: 600, fontSize: 14 }}>Frequency</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
          {FREQUENCIES.map(f => (
            <button key={f.id} onClick={() => setFreq(f.id)} style={{
              background: freq === f.id ? "#1A1A2E" : "#FFF1F2",
              color: freq === f.id ? "#fff" : "#44403c",
              border: 0, padding: "8px 14px", borderRadius: 999, fontWeight: 700, fontSize: 13, cursor: "pointer"
            }}>{f.label}</button>
          ))}
        </div>

        {freq === "custom" && <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
          <label key={d} style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4 }}><input type="checkbox" onChange={e => setCustomDays(prev => e.target.checked ? [...prev, d] : prev.filter(x => x !== d))} /> {d}</label>
        ))}</div>}

        <label style={{ display: "block", marginTop: 14, fontWeight: 600, fontSize: 14 }}>Delivery Slot</label>
        <select value={slot} onChange={e => setSlot(e.target.value)} style={{ width: "100%", padding: 11, borderRadius: 12, border: "2px solid #FFE4E6", marginTop: 6 }}>
          {SLOTS.filter(s => s !== "00:00 - 00:00").map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <p style={{ fontSize: 12, color: "#DC2626", margin: "6px 0 0" }}>⏰ Cutoff: 9 PM today for tomorrow delivery.</p>

        <label style={{ display: "block", marginTop: 14, fontWeight: 600, fontSize: 14 }}>Payment</label>
        <select value={payment} onChange={e => setPayment(e.target.value)} style={{ width: "100%", padding: 11, borderRadius: 12, border: "2px solid #FFE4E6", marginTop: 6 }}>
          <option value="wallet">Wallet (₹{wallet} balance)</option>
          <option value="card">Card - Auto Debit</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <label style={{ display: "block", marginTop: 14, fontWeight: 600, fontSize: 14 }}>If Out of Stock?</label>
        <select value={substitutePref} onChange={e => setSubstitutePref(e.target.value)} style={{ width: "100%", padding: 11, borderRadius: 12, border: "2px solid #FFE4E6", marginTop: 6 }}>
          <option value="Allow Substitute">Allow Substitute - Similar item</option>
          <option value="Skip Item">Skip Item if out of stock</option>
          <option value="Call Me">Call me before substitute</option>
        </select>

        <h4 style={{ marginTop: 18, marginBottom: 8 }}>Cart ({cart.length})</h4>
        {cart.length === 0 ? <p style={{ fontSize: 13, color: "#78716c" }}>No items yet. Click Add + on left.</p> : null}
        {cart.map(i => <div key={i.product._id || i.product.id} style={{ fontSize: 14, display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span>{i.product.name} x {i.qty}</span><b>₹{i.product.price * i.qty}</b></div>)}
        <div style={{ borderTop: "1px dashed #e7e5e4", marginTop: 10, paddingTop: 10, fontSize: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal:</span><span>₹{total}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#FF4D6D", fontWeight: 600 }}><span>Subscription Discount (5%{freq === "weekly" ? " + ₹20 Weekly Bundle" : ""}):</span><span>-₹{discount}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 16 }}><b>Total / Delivery:</b><b>₹{finalTotal}</b></div>
        </div>

        <button
          onClick={handleCreate}
          disabled={cart.length === 0}
          style={{
            width: "100%", marginTop: 14,
            background: cart.length === 0 ? "#E7E5E4" : "linear-gradient(135deg,#FF4D6D,#FF8A00)",
            color: cart.length === 0 ? "#78716c" : "#fff",
            padding: 13, border: 0, borderRadius: 12, fontWeight: 800, fontSize: 15,
            cursor: cart.length === 0 ? "not-allowed" : "pointer",
            boxShadow: cart.length === 0 ? "none" : "0 6px 16px rgba(255,77,109,0.35)"
          }}>
          {cart.length === 0 ? "Add items to start →" : "Start Subscription →"}
        </button>
      </div>
    </div>
  );
}