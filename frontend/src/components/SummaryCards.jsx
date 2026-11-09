import React from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Percent } from 'lucide-react';

export const SummaryCards = ({ summary }) => {
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="summary-info">
          <p>Total Balance</p>
          <h2>{formatINR(summary?.netBalance)}</h2>
          <small style={{ color: summary?.netBalance >= 0 ? '#10b981' : '#ef4444' }}>
            {summary?.netBalance >= 0 ? 'Surplus Available' : 'Deficit Recorded'}
          </small>
        </div>
        <div className="summary-icon icon-balance">
          <IndianRupee size={22} />
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-info">
          <p>Total Inflow</p>
          <h2 style={{ color: '#10b981' }}>{formatINR(summary?.totalIncome)}</h2>
          <small style={{ color: '#64748b' }}>Salary & Income streams</small>
        </div>
        <div className="summary-icon icon-income">
          <TrendingUp size={22} />
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-info">
          <p>Total Outflow</p>
          <h2 style={{ color: '#ef4444' }}>{formatINR(summary?.totalExpense)}</h2>
          <small style={{ color: '#64748b' }}>Daily expenses & bills</small>
        </div>
        <div className="summary-icon icon-expense">
          <TrendingDown size={22} />
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-info">
          <p>Savings Ratio</p>
          <h2 style={{ color: '#3b82f6' }}>{summary?.savingsRate || 0}%</h2>
          <small style={{ color: '#64748b' }}>Net savings retained</small>
        </div>
        <div className="summary-icon icon-savings">
          <Percent size={20} />
        </div>
      </div>
    </div>
  );
};
