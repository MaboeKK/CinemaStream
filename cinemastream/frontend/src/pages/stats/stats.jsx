import "./stats.scss"
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import Stats from "../../Components/statscard/Stats";


const Statistics = () => {
    return (
         <div className="stats">
            <Sidebar />
            <div className="statsContainer">
                <Navbar />
                <div className="statscard">
                <Stats/>
                </div>
            </div>
        </div>

    );
};

export default Statistics;