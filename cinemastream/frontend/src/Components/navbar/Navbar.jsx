import "./navbar.scss"
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";


const Navbar = () => {
    const  { dispatch } = useContext(DarkModeContext)

    return (
        <div className='navbar'>
        <div className="wrapper">
            <div className="header">
              <p>Hello, Lewela</p> {/*<p>Hello, {user.first_name}</p>*/}
                </div>
                <div className="items">
                    <div className="item">
                        <DarkModeOutlinedIcon className="icon"
                        onClick={() => dispatch({ type: "TOGGLE"})}/>
                        <span className="mode-label">Light Mode</span>
                    </div>
                    <div className="profile">
                      <AccountCircleOutlinedIcon className="icons"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar

