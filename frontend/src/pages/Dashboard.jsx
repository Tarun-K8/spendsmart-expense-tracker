import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { SummaryCards } from '../components/SummaryCards';
import { SpendingChart } from '../components/SpendingChart';
import { TransactionList } from '../components/TransactionList';
import { TransactionModal } from '../components/TransactionModal';
import { apiService } from '../services/api';

export const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [txList, stats] = await Promise.all([
        apiService.getTransactions(),
        apiService.getAnalyticsSummary(),
      ]);
      setTransactions(txList || []);
      setAnalytics(stats);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (newTx) => {
    await apiService.createTransaction(newTx);
    await loadData();
  };

  const handleDeleteTransaction = async (id) => {
    await apiService.deleteTransaction(id);
    await loadData();
  };

  return (
    <div className="app-container">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      <main className="main-content">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Financial Dashboard</h1>
            <p>Real-time analytics, category tracking, and expenditure flow</p>
          </div>
        </div>

        <SummaryCards summary={analytics?.summary} />

        <div className="dashboard-grid">
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
          />

          <SpendingChart
            categoryBreakdown={analytics?.categoryBreakdown}
            totalExpense={analytics?.summary?.totalExpense || 0}
          />
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
};
