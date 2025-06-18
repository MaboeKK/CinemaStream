
// import "./home.scss";
// import Sidebar from "../../Components/sidebar/Sidebar";
// import Navbar from "../../Components/Navbar/Navbar";
// import Widget from "../../Components/widget/Widget";
// import Featured from "../../Components/Featured/Featured";
// import Chart from "../../Components/chart/Chart";
// import Heatmap from "../../Components/Heatmap/Heatmap";

// const Home = () => {
//     return (
//         <div className="dashboard-home">
//             <Sidebar />
//             <div className="dashboard-homeContainer">
//                 <Navbar />
//                 <div className="widgets">
//                     <Widget type="users" />
//                     <Widget type= "genres"/> 
//                 </div>
//                 <div className="charts">
//                 <Featured/>
//                 <Chart/>
//                 </div>
//                 <div className="heatmap">
//                     <Heatmap/>
               
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Home;
import "./home.scss";
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import Widget from "../../Components/widget/Widget";
import Featured from "../../Components/Featured/Featured";
import Chart from "../../Components/chart/Chart";
import Heatmap from "../../Components/Heatmap/Heatmap";

const Home = () => {
    return (
        <div className="dashboard-home">
            <Sidebar />
            <div className="dashboard-homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget type="users" />
                    <Widget type="genres" />
                </div>
                <div className="charts">
                    <Featured />   
                </div>
                <div className="chart-wrapper">
                    <Chart />
                </div>
                
                



                <div className="heatmap">
                    <Heatmap />
                </div>
            </div>
        </div>
    );
};

export default Home;
