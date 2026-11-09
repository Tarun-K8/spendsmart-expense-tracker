import React from 'react';
import { PieChart } from 'lucide-react';

export const SpendingChart = ({ categoryBreakdown, totalExpense }) => {
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const categories = categoryBreakdown || [];

  return (
    <div className="card">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PieChart size={20} color="#861F41" />
          <h3 className="card-title">Expense Distribution by Category</h3>
        </div>
        <span style={{ fontSize: '13px', color: '#64748b' }}>
          {categories.length} Categories
        </span>
      </div>

      {categories.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
          No expense transactions recorded yet.
        </p>
      ) : (
        <div className="category-bars">
          {categories.map((item) => {
            const percentage =
              totalExpense > 0
                ? ((item.totalAmount / totalExpense) * 100).toFixed(1)
                : 0;

            return (
              <div key={item.category} className="category-bar-item">
                <div className="bar-meta">
                  <span>{item.category}</span>
                  <span>
                    {formatINR(item.totalAmount)}{' '}
                    <span style={{ color: '#64748b', fontWeight: 500 }}>
                      ({percentage}%)
                    </span>
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
