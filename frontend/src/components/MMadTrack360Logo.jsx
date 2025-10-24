import React from "react";

const MMadTrack360Logo = ({ style }) => (
  <img
    src="/src/assets/MMAD_App_logo.jpeg"
    alt="MMadTrack360 Logo"
    style={{
      width: style?.width || 120,
      height: style?.height || "auto",
      objectFit: "contain",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      marginBottom: style?.marginBottom || 32,
      ...style
    }}
  />
);

export default MMadTrack360Logo;
