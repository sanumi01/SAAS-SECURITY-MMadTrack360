import React from "react";
import { cognitoConfig } from "../auth/cognito-config";

const LoginButton = () => {
  const { domain, clientId, redirectUri, responseType, scopes } = cognitoConfig;
  const scopeParam = scopes.join("+");

  const loginUrl = `${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scopeParam}&redirect_uri=${redirectUri}`;

  return (
    <button
      onClick={() => (window.location.href = loginUrl)}
      style={{
        padding: "14px 28px",
        fontSize: "18px",
        backgroundColor: "#00bfff",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        transition: "transform 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      Login with MMadTrack360
    </button>
  );
};

export default LoginButton;
