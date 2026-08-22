import React from "react";

const DetectExpressionBtn = ({ isDetecting, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`detect-btn ${isDetecting ? "active" : ""}`}
      style={{
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: "600",
        borderRadius: "0.5rem",
        border: "none",
        cursor: "pointer",
        background: isDetecting
          ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        color: "#ffffff",
        boxShadow: isDetecting
          ? "0 4px 12px rgba(239, 68, 68, 0.2)"
          : "0 4px 12px rgba(99, 102, 241, 0.2)",
        transition: "all 0.2s ease",
        margin: "1rem 0",
      }}
    >
      {isDetecting ? "Scanning..." : "Detect Expression"}
    </button>
  );
};

export default DetectExpressionBtn;
