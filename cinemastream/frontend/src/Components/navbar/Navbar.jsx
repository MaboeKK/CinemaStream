

import "./navbar.scss";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";

const Navbar = () => {
    const { dispatch } = useContext(DarkModeContext);

    return (
        <div className='dashboard-navbar'>
            <div className="dashboard-navbar-wrapper">
                <div className="dashboard-nav-actions">
                    <DarkModeOutlinedIcon className="icon" onClick={() => dispatch({ type: "TOGGLE" })} />
                    <AccountCircleOutlinedIcon className="icon" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
