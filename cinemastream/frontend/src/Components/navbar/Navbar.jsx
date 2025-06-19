

import "./navbar.scss";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
//import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import AdminProfile from "../admin/AdminProfile";

const Navbar = () => {
    const { dispatch } = useContext(DarkModeContext);

    return (
        <div className='dashboard-navbar'>
            <div className="dashboard-navbar-wrapper">
                <div className="dashboard-nav-actions">
                    <DarkModeOutlinedIcon className="icon" onClick={() => dispatch({ type: "TOGGLE" })} />
                    <AdminProfile />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
