import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminProfile from './AdminProfile';
import './AdminNavbar.scss';

const AdminNavbar = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-navbar">
      <div className="dashboard-navbar-wrapper">
        <div className="dashboard-nav-actions">
          <AdminProfile user={user} />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
