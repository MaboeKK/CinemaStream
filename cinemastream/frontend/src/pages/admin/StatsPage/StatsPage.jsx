import React from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminNavbar from '../../../components/admin/AdminNavbar';
import StatsCards from '../../../components/admin/StatsCards';
import './StatsPage.scss';

const StatsPage = () => (
  <div className="admin-stats">
    <AdminSidebar />
    <div className="admin-statsContainer">
      <AdminNavbar />
      <div className="statscard">
        <StatsCards />
      </div>
    </div>
  </div>
);

export default StatsPage;
