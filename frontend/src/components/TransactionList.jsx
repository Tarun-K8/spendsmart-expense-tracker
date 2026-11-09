import React, { useState } from 'react';
import { Trash2, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

const CATEGORY_ICONS = {
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  'Food & Dining': '🍔',
  Shopping: '🛍️',
  Transportation: '🚗',
  'Housing & Rent': '🏠',
  Utilities: '⚡',
  Entertainment: '🎬',
  'Health & Medical': '💊',
  Other: '📌',
};

export const TransactionList = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState('all');

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Transactions</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'income', 'expense'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`btn btn-outline`}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                textTransform: 'capitalize',
                background: filter === t ? '#f1f5f9' : 'transparent',
                fontWeight: filter === t ? '700' : '500',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
          No transactions found for the selected filter.
        </p>
      ) : (
        <div className="transaction-list">
          {filtered.map((item) => (
            <div key={item._id} className="transaction-item">
              <div className="transaction-left">
                <div
                  className="category-badge"
                  style={{
                    background: item.type === 'income' ? '#ecfdf5' : '#fef2f2',
                  }}
                >
                  {CATEGORY_ICONS[item.category] || '💰'}
                </div>
                <div className="transaction-meta">
                  <h4>{item.title}</h4>
                  <span>
                    {item.category} • {formatDate(item.date)}
                  </span>
                </div>
              </div>

              <div className="transaction-right">
                <span
                  className={`transaction-amount ${
                    item.type === 'income' ? 'amount-income' : 'amount-expense'
                  }`}
                >
                  {item.type === 'income' ? '+' : '-'} {formatINR(item.amount)}
                </span>
                <button
                  className="delete-btn"
                  onClick={() => onDelete(item._id)}
                  title="Delete Transaction"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
