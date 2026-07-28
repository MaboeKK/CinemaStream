import React from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import AdminNavbar from '../../../components/admin/AdminNavbar';
import UsersDataTable from '../../../components/admin/UsersDataTable';
import './UsersPage.scss';

const UsersPage = () => (
  <div className="admin-list">
    <AdminSidebar />
    <div className="admin-listContainer">
      <AdminNavbar />
      <UsersDataTable />
    </div>
  </div>
);

export default UsersPage;
