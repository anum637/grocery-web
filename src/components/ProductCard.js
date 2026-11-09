import React from 'react';

function ProductCard({ product, onAddToCart, onSubscribe }) {
  if (!product) return null;
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '12px', background: '#fff' }}>
      <div style={{ width: '100%', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '90px', background: '#fdf2f8', borderRadius: '8px' }}>
        {product.emoji || '🥬'}
      </div>

      <h3 style={{ margin: '10px 0 4px' }}>{product.name}</h3>
      <p style={{ color: '#666', margin: '0 0 6px' }}>{product.category || 'Fresh'} {product.unit ? `• per ${product.unit}` : ''}</p>

      <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '0 0 4px' }}>
        ₹{product.price}{' '}
        {product.mrp && product.mrp > product.price && (
          <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '13px', fontWeight: 'normal', marginLeft: 6 }}>
            ₹{product.mrp}
          </span>
        )}
      </p>

      <p style={{ fontSize: '12px', color: product.stock < 30 ? 'red' : 'green', margin: 0 }}>
        {product.stock} in stock {product.stock < 30 ? '• Low' : ''}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button onClick={() => onAddToCart && onAddToCart(product)} style={{ flex: 1, padding: '8px', background: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add +</button>
        <button onClick={() => onSubscribe && onSubscribe(product)} style={{ flex: 1, padding: '8px', background: '#fff', border: '1px solid #f97316', color: '#f97316', borderRadius: '8px', cursor: 'pointer' }}>Subscribe</button>
      </div>
    </div>
  );
}

export default ProductCard;