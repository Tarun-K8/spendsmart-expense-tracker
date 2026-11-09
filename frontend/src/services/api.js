const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('spendsmart_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiService = {
  // Authentication
  async register(name, email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      // Mock fallback for offline demonstration
      console.warn('API Offline, using local session:', err.message);
      const mockUser = { _id: 'demo-123', name, email, token: 'demo-jwt-token' };
      localStorage.setItem('spendsmart_user', JSON.stringify(mockUser));
      localStorage.setItem('spendsmart_token', mockUser.token);
      return { success: true, data: mockUser };
    }
  },

  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      console.warn('API Offline, using local session:', err.message);
      const mockUser = {
        _id: 'demo-123',
        name: 'Tarun Kumar',
        email,
        token: 'demo-jwt-token',
      };
      localStorage.setItem('spendsmart_user', JSON.stringify(mockUser));
      localStorage.setItem('spendsmart_token', mockUser.token);
      return { success: true, data: mockUser };
    }
  },

  // Transactions
  async getTransactions() {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.data;
    } catch (err) {
      const stored = localStorage.getItem('spendsmart_demo_transactions');
      return stored ? JSON.parse(stored) : getDefaultDemoTransactions();
    }
  },

  async createTransaction(transaction) {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transaction),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.data;
    } catch (err) {
      const current = await this.getTransactions();
      const newTx = { ...transaction, _id: 'tx-' + Date.now(), date: new Date().toISOString() };
      const updated = [newTx, ...current];
      localStorage.setItem('spendsmart_demo_transactions', JSON.stringify(updated));
      return newTx;
    }
  },

  async deleteTransaction(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      const current = await this.getTransactions();
      const updated = current.filter((t) => t._id !== id);
      localStorage.setItem('spendsmart_demo_transactions', JSON.stringify(updated));
      return { success: true };
    }
  },

  // Analytics
  async getAnalyticsSummary() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/summary`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.data;
    } catch (err) {
      const transactions = await this.getTransactions();
      return calculateLocalAnalytics(transactions);
    }
  },
};

function calculateLocalAnalytics(transactions) {
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap = {};

  transactions.forEach((tx) => {
    const amount = Number(tx.amount) || 0;
    if (tx.type === 'income') {
      totalIncome += amount;
    } else {
      totalExpense += amount;
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + amount;
    }
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, totalAmount]) => ({ category, totalAmount }))
    .sort((a, b) => b.totalAmount - a.totalAmount);

  return {
    summary: {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? Number((((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)) : 0,
    },
    categoryBreakdown,
  };
}

function getDefaultDemoTransactions() {
  return [
    { _id: '1', title: 'Tech Internship Stipend', amount: 45000, type: 'income', category: 'Salary', date: new Date().toISOString() },
    { _id: '2', title: 'Hostel Rent & Mess', amount: 12000, type: 'expense', category: 'Housing & Rent', date: new Date().toISOString() },
    { _id: '3', title: 'Books & Course Materials', amount: 3200, type: 'expense', category: 'Other', date: new Date().toISOString() },
    { _id: '4', title: 'Weekend Dining Out', amount: 1850, type: 'expense', category: 'Food & Dining', date: new Date().toISOString() },
    { _id: '5', title: 'Freelance Frontend Gig', amount: 15000, type: 'income', category: 'Freelance', date: new Date().toISOString() },
  ];
}
