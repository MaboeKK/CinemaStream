import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import HistoryIcon from '@mui/icons-material/History';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.scss';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-sidebar">
      <div className="dashboard-sidebar-top">
        <span className="dashboard-sidebar-logo">CinemaStream</span>
      </div>
      <hr />
      <div className="dashboard-sidebar-center">
        <ul>
          <Link to="/admin" className="link">
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link to="/admin/users" className="link">
            <li>
              <PersonOutlineOutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/admin/stats" className="link">
            <li>
              <QueryStatsIcon className="icon" />
              <span>Stats</span>
            </li>
          </Link>
          <Link to="/admin/audit-log" className="link">
            <li>
              <HistoryIcon className="icon" />
              <span>Audit Log</span>
            </li>
          </Link>
          <Link to="/admin/content" className="link">
            <li>
              <MovieFilterOutlinedIcon className="icon" />
              <span>Content</span>
            </li>
          </Link>
          <button className="link" onClick={handleLogout}>
            <li>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </button>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
