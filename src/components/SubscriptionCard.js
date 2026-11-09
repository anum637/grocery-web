import React from 'react';

function SubscriptionCard({ subscription, onRemove }) {
  if (!subscription) return null;
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '16px', background: '#fff', marginBottom: '12px' }}>
      <h3 style={{ margin: '0 0 6px' }}>{subscription.productName || subscription.name || 'Subscription'}</h3>
      <p style={{ color: '#666', margin: '4px 0' }}>Plan: {subscription.plan || 'Daily'}</p>
      <p style={{ color: '#666', margin: '4px 0' }}>Qty: {subscription.quantity || 1} | Price: ₹{subscription.price || 0}</p>
      <p style={{ color: '#666', margin: '4px 0' }}>Start: {subscription.startDate || 'Today'}</p>
      <p style={{ fontWeight: 'bold', color: '#16a34a' }}>Status: {subscription.status || 'Active'}</p>
      {onRemove && (
        <button onClick={() => onRemove(subscription.id)} style={{ marginTop: '10px', padding: '8px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Cancel Subscription
        </button>
      )}
    </div>
  );
}

export default SubscriptionCard;