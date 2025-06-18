
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
        linkTo: "/stats",
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
      
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;

