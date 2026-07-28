import React from 'react';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useDarkMode } from '../../context/DarkModeContext';
import { useAuth } from '../../context/AuthContext';
import AdminProfile from './AdminProfile';
import './AdminNavbar.scss';

const AdminNavbar = () => {
  const { toggleDarkMode } = useDarkMode();
  const { user } = useAuth();

  return (
    <div className="dashboard-navbar">
      <div className="dashboard-navbar-wrapper">
        <div className="dashboard-nav-actions">
          <DarkModeOutlinedIcon className="icon" onClick={toggleDarkMode} />
          <AdminProfile user={user} />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
