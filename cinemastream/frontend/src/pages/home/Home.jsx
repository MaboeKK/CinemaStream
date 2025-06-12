
import "./home.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import Widget from "../../Components/widget/Widget";
import Featured from "../../Components/Featured/Featured";
import Chart from "../../Components/chart/Chart";
import Heatmap from "../../Components/Heatmap/Heatmap";

const Home = () => {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget type="users" />
                    <Widget type= "earnings"/> 
                </div>
                <div className="charts">
                <Featured/>
                <Chart/>
                </div>
                <div className="heatmap">
                    <Heatmap/>
               
                </div>
            </div>
        </div>
    );
};

export default Home;
