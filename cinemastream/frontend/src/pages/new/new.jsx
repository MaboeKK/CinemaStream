
import "./new.scss"
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import Profile from "../../Components/Profile/Profile";


const New = () => {
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <Profile />
            </div>
        </div>
    )
};

export default New