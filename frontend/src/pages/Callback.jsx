import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      fetch("https://us-west-2_mKClK8Ign.auth.us-west-2.amazoncognito.com/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: "3cpdkmdjmjupc2bubks1ilkiml",
          code,
          redirect_uri: "https://mmadtrack360.com/callback"
        })
      })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("access_token", data.access_token);
        navigate("/dashboard");
      });
    }
  }, [navigate]);

  return <p>Authenticating...</p>;
};

export default Callback;
