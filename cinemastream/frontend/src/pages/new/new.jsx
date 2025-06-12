// import "./new.scss"
// import Sidebar from "../../components/sidebar/Sidebar";
// import Navbar from "../../components/navbar/Navbar";
// import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
// const New = () => {
//     return (
//         <div className="new"> 
//         <Sidebar />
//         <div className="newContainer">
//         <Navbar /> 
//         <div className="top">
//             <h1>Add a New Admin</h1>
//         </div>
//         <div className="bottom">
//             <div className="left">
//                <img src="https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
//                 alt="" />
//             </div>
//               <div className="formInput">
//                 <label htmlFor="file">
//                     Image: <DriveFolderUploadOutlinedIcon  className="icon"/>
//                 </label>
//                  <input type="file" id="file" style={{ display: "none" }}/>
//             </div>
//             <div className="formInput">
//                 <label>Name and Surname</label>
//                  <input type="text" placeholder="Wandile Chauke"/>
//             </div>
//              <div className="formInput">
//                 <label>Email</label>
//                  <input type="email" placeholder="wandilechauke@gmail.com"/>
//             </div>
//              <div className="formInput">
//                 <label>Password</label>
//                  <input type="password" />
//             </div>
//             <button>Add Admin</button>
//         </div>
//         </div>
//         </div>
//     );
// };

// export default New
import "./new.scss"
import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
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