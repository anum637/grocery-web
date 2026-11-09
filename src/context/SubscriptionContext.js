import { createContext, useState, useContext } from "react";
const Ctx = createContext();
export const useSubs = () => useContext(Ctx);

export function SubscriptionProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [wallet, setWallet] = useState(520);
  const [loyalty, setLoyalty] = useState(120);

  const addToCart = (product) => {
  const pid = product._id || product.id;
  setCart(prev => {
    const found = prev.find(i => (i.product._id || i.product.id) === pid);
    if(found) return prev.map(i => (i.product._id || i.product.id)===pid ? {...i, qty: i.qty+1} : i);
    return [...prev, {product, qty:1}];
  });
};

  const createSubscription = (data) => {
    // data.total is the subscription total, e.g. 76
    if(wallet < data.total){
      alert("Not enough wallet balance!");
      return false;
    }
    setWallet(prev => prev - data.total);
    setLoyalty(prev => prev + Math.floor(data.total / 10)); // 1 point per ₹10
    setSubscriptions(prev => [...prev, { id: Date.now(), ...data, status:"active" }]);
    setCart([]);
    return true;
  };

  const updateStatus = (id, status) => {
    setSubscriptions(prev => prev.map(s => s.id===id ? {...s, status} : s));
  };

  const skipTomorrow = (id) => {
    setSubscriptions(prev => prev.map(s => s.id===id ? {...s, skipped: !s.skipped} : s));
  };

  const reschedule = (id, newSlot) => {
    setSubscriptions(prev => prev.map(s => s.id===id ? {...s, slot: newSlot} : s));
  };

  return <Ctx.Provider value={{cart, addToCart, setCart, subscriptions, createSubscription, updateStatus, wallet, loyalty, skipTomorrow, reschedule}}>{children}</Ctx.Provider>
}