import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ cartCount = 0 }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', background: '#16a34a', color: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to="/" style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold', textDecoration: 'none' }}>DailyFresh 🥦</Link>
      <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/shop" style={{ color: '#fff', textDecoration: 'none' }}>Shop</Link>
        <Link to="/subscription" style={{ color: '#fff', textDecoration: 'none' }}>Subscription</Link>
        <Link to="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
        <Link to="/cart" style={{ color: '#fff', textDecoration: 'none', background: '#fff', color: '#16a34a', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold' }}>Cart ({cartCount})</Link>
      </div>
    </nav>
  );
}

export default Navbar;