import React, { useState } from "react";
import './LoginRegister.css';
import { FaLock, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import axios from "axios";

const LoginRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  //const handleTogglePassword = () => setShowPassword(prev => !prev);

  const toggleForm = (e) => {
    e.preventDefault(); // Prevents page jump
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setIsLogin(prev => !prev);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isLogin && password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  
  const endpoint = isLogin ? "login" : "signup";
  const payload = isLogin
    ? { email, password }
    : { first_name:firstName, last_name:lastName, email, password };

  

  try {
    const response = await axios.post(`http://localhost:5000/api/auth/${endpoint}`, payload);
    alert(response.data.message || "Success");

    if (!isLogin) toggleForm(e); // Switch to login after successful registration
  } catch (err) {
    console.error(err);
    alert("Error: " + (err.response?.data?.error || err.message));
  }
};


  return (
    <div className="wrapper">
      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <h1>{isLogin ? "Login" : "Register"}</h1>

          {!isLogin && (
            <>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Phone Number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <FaPhoneAlt className="icon" />
              </div>
            </>
          )}

          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MdEmail className="icon" />
          </div>

          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          {!isLogin && (
            <div className="input-box">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FaLock className="icon" />
            </div>
          )}

          {isLogin && (
            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
          )}

          <button type="submit">{isLogin ? "Login" : "Register"}</button>

          <div className="register-link">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <a href="#" onClick={toggleForm}>
                {isLogin ? " Register" : " Login"}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;