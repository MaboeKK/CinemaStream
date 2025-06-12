
// import "./sidebar.scss";
// import React from "react";
// import { Link } from "react-router-dom";

// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import AccountBoxIcon from '@mui/icons-material/AccountBox';
// import QueryStatsIcon from '@mui/icons-material/QueryStats';
// import SettingsIcon from '@mui/icons-material/Settings';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// const Sidebar = () => {
//   return (
//     <div className='sidebar'>
//       <div className="top">
//         <span className="logo">Admin Dashboard</span>
//       </div>
//       <hr />
//       <div className="center">
//         <ul>
//           <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
//             <li>
//               <DashboardIcon className="icon" />
//               <span>Dashboard</span>
//             </li>
//           </Link>

//           <Link to="/list" style={{ textDecoration: "none", color: "inherit" }}>
//             <li>
//               <PersonOutlineOutlinedIcon className="icon" />
//               <span>Users</span>
//             </li>
//           </Link>

//           <Link to="/stats" style={{ textDecoration: "none", color: "inherit" }}>
//             <li>
//               <QueryStatsIcon className="icon" />
//               <span>Stats</span>
//             </li>
//           </Link>

//           <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
//             <li>
//               <AccountBoxIcon className="icon" />
//               <span>Profile</span>
//             </li>
//           </Link>

//           <Link to="/settings" style={{ textDecoration: "none", color: "inherit" }}>
//             <li>
//               <SettingsIcon className="icon" />
//               <span>Settings</span>
//             </li>
//           </Link>

//           <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
//             <li>
//               <ExitToAppIcon className="icon" />
//               <span>LogOut</span>
//             </li>
//           </Link>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
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
    <div className='sidebar'>
      <div className="top">
        <span className="logo">Admin Dashboard</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          <Link to="/list" style={{ textDecoration: "none", color: "inherit" }}>
            <li>
              <PersonOutlineOutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>

          <Link to="/stats" style={{ textDecoration: "none", color: "inherit" }}>
            <li>
              <QueryStatsIcon className="icon" />
              <span>Stats</span>
            </li>
          </Link>

          {/* ✅ Profile now routes to /profile (which renders New component) */}
          <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
            <li>
              <AccountBoxIcon className="icon" />
              <span>Admin</span>
            </li>
          </Link>

          <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
            <li>
              <ExitToAppIcon className="icon" />
              <span>LogOut</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
