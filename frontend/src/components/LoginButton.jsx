
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Choose Login Option</h2>
      <button style={{margin: "10px", padding: "14px 28px"}} onClick={() => navigate("/admin")}>Admin Login</button>
      <button style={{margin: "10px", padding: "14px 28px"}} onClick={() => navigate("/staff")}>Staff Login</button>
      <button style={{margin: "10px", padding: "14px 28px"}} onClick={() => navigate("/admin-signup")}>Admin Signup</button>
    </div>
  );
};

export default LoginButton;
