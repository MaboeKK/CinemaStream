
// import "./widget.scss";
// import { Link } from "react-router-dom";
// import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
// import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

// const Widget = ({ type }) => {
//   let data;

//   // Temporary static values
//   const amount = 11000000;
//   const diff = 80;

//   // Switch widget type to configure title, link, icon
//   switch (type) {
//     case "users":
//       data = {
//         title: "USERS",
//         isMoney: false,
//         link: "See all users",
//         linkTo: "/users", // link path for routing
//         icon: (
//           <PersonOutlineOutlinedIcon
//             className="icon"
//             style={{
//               color: "crimson",
//               backgroundColor: "rgba(255, 0, 0, 0.2)",
//             }}
//           />
//         ),
//       };
//       break;

//     case "earnings":
//       data = {
//         title: "EARNINGS",
//         isMoney: true,
//         link: "View all earnings",
//         linkTo: "/earnings", // placeholder; route must exist
//         icon: (
//           <MonetizationOnOutlinedIcon
//             className="icon"
//             style={{
//               backgroundColor: "rgba(0, 128, 0, 0.2)",
//               color: "green",
//             }}
//           />
//         ),
//       };
//       break;

//     default:
//       data = {
//         title: "UNKNOWN",
//         isMoney: false,
//         link: "N/A",
//         linkTo: "/",
//         icon: null,
//       };
//       break;
//   }

//   return (
//     <div className="widget">
//       <div className="left">
//         <span className="title">{data.title}</span>
//         <span className="counter">
//           {data.isMoney && "$"}
//           {amount.toLocaleString()}
//         </span>
//         <Link to={data.linkTo} className="link">
//           {data.link}
//         </Link>
//       </div>
//       <div className="right">
//         <div className="percentage positive">
//           <KeyboardArrowUpOutlinedIcon />
//           {diff}%
//         </div>
//         {data.icon}
//       </div>
//     </div>
//   );
// };

// export default Widget;
// import "./widget.scss";
// import { Link } from "react-router-dom";
// import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
// import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
// import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";

// const Widget = ({ type }) => {
//   let data;

//   // Static values
//   const diff = 12;

//   // Example top genres
//   const topGenres = ["Action", "Drama", "Thriller", "Comedy", "Sci-Fi"];

//   switch (type) {
//     case "users":
//       data = {
//         title: "USERS",
//         value: "11,000", // Instead of amount
//         link: "See all users",
//         linkTo: "/users",
//         icon: (
//           <PersonOutlineOutlinedIcon
//             className="icon"
//             style={{
//               color: "crimson",
//               backgroundColor: "rgba(255, 0, 0, 0.2)",
//             }}
//           />
//         ),
//       };
//       break;

//     case "watchtime":
//       data = {
//         title: "WATCH TIME",
//         value: "1,200 hrs",
//         link: "View watch stats",
//         linkTo: "/watchtime",
//         icon: (
//           <AccessTimeOutlinedIcon
//             className="icon"
//             style={{
//               backgroundColor: "rgba(0, 0, 255, 0.2)",
//               color: "navy",
//             }}
//           />
//         ),
//       };
//       break;

//     case "genres":
//       data = {
//         title: "TOP GENRES",
//         value: topGenres.join(", "),
//         link: "Explore genres",
//         linkTo: "/single",
//         icon: (
//           <MovieOutlinedIcon
//             className="icon"
//             style={{
//               backgroundColor: "rgba(128, 0, 128, 0.2)",
//               color: "purple",
//             }}
//           />
//         ),
//       };
//       break;

//     default:
//       data = {
//         title: "UNKNOWN",
//         value: "N/A",
//         link: "N/A",
//         linkTo: "/",
//         icon: null,
//       };
//       break;
//   }

//   return (
//     <div className="widget">
//       <div className="left">
//         <span className="title">{data.title}</span>
//         <span className="counter genre-counter">{data.value}</span>
//         <Link to={data.linkTo} className="link">
//           {data.link}
//         </Link>
//       </div>
//       <div className="right">
//         <div className="percentage positive">
//           <KeyboardArrowUpOutlinedIcon />
//           {diff}%
//         </div>
//         {data.icon}
//       </div>
//     </div>
//   );
// };
// export default Widget;
import "./widget.scss";
import { Link } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";

const Widget = ({ type }) => {
  let data;

  // Example top genres
  const topGenres = ["Action", "Drama", "Thriller", "Comedy", "Sci-Fi"];

  switch (type) {
    case "users":
      data = {
        title: "USERS",
        value: "See all the users that have registered",
        link: "See all users",
        linkTo: "/users",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;

    case "watchtime":
      data = {
        title: "WATCH TIME",
        value: "1,200 hrs",
        link: "View watch stats",
        linkTo: "/watchtime",
        icon: (
          <AccessTimeOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              color: "navy",
            }}
          />
        ),
      };
      break;

    case "genres":
      data = {
        title: "TOP GENRES",
        value: topGenres.join(", "),
        link: "Explore genres",
        linkTo: "/single",
        icon: (
          <MovieOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;

    default:
      data = {
        title: "UNKNOWN",
        value: "N/A",
        link: "N/A",
        linkTo: "/",
        icon: null,
      };
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter genre-counter">{data.value}</span>
        <Link to={data.linkTo} className="link">
          {data.link}
        </Link>
      </div>
      <div className="right">
        {/* Removed percentage and arrow */}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;

