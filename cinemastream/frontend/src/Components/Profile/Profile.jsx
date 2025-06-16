
import "./profile.scss";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";

const Profile = () => {
  const [file, setFile] = useState(null);

  return (
    <div className="profile">
      <div className="top">
        <h1>Add a New Admin</h1>
      </div>

      <div className="bottom">
        <div className="left">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt=""
          />
        </div>
        <div className="right">
          <div className="formInput">
            <label htmlFor="file">
              Image: <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
          </div>
          <div className="formInput">
            <label>Name:</label>
            <input type="text" placeholder="Enter name" />
          </div>
          <div className="formInput">
            <label>Surname:</label>
            <input type="text" placeholder="Enter surname" />
          </div>
          <div className="formInput">
            <label>Email:</label>
            <input type="email" placeholder="Enter email" />
          </div>
          <button>Add Admin</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="tableContainer">
        <h2>Existing Admins</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Jonathan</td>
              <td>Mpondo</td>
              <td>john.mpondo@example.com</td>
            </tr>
            <tr>
              <td>Rose</td>
              <td>Makgato</td>
              <td>Rose.Makgato@example.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
