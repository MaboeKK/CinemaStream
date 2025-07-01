import "./sidebar.scss";
import React from "react";
import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = () => {
  return (
    <div className="dashboard-sidebar">
      <div className="dashboard-sidebar-top">
        <span className="dashboard-sidebar-logo">CinemaStream</span>
      </div>
      <hr />
      <div className="dashboard-sidebar-center">
        <ul>
          <Link to="/" className="link">
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link to="/list" className="link">
            <li>
              <PersonOutlineOutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/stats" className="link">
            <li>
              <QueryStatsIcon className="icon" />
              <span>Stats</span>
            </li>
          </Link>
          <Link to="/login" className="link">
            <li>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
