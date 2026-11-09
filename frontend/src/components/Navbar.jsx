import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, PlusCircle } from 'lucide-react';

export const Navbar = ({ onOpenModal }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <Wallet size={26} />
          <span>SpendSmart</span>
          <span className="brand-badge">Financial OS</span>
        </div>

        <div className="nav-user">
          <button className="btn btn-primary" onClick={onOpenModal}>
            <PlusCircle size={16} />
            Add Transaction
          </button>
          {user && (
            <>
              <span className="user-name">{user.name}</span>
              <button className="btn btn-outline" onClick={logout} title="Sign Out">
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
