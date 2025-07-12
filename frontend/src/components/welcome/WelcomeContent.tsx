import { formatTime, formatDate } from "../../utils/dateUtils";

interface WelcomeContentProps {
  isVisible: boolean;
  currentTime: Date;
  onTryMeClick: () => void;
  onLogout: () => void;
}

export default function WelcomeContent({
  isVisible,
  currentTime,
  onTryMeClick,
  onLogout,
}: WelcomeContentProps) {
  return (
    <div
      style={{
        textAlign: "center",
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 10,
      }}
    >
      {/* Welcome heading */}
      <h1
        style={{
          fontSize: "clamp(2.5rem, 8vw, 5rem)",
          fontWeight: "700",
          background: "linear-gradient(45deg, #40e0d0, #8a2be2, #00ffff)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
          letterSpacing: "-0.02em",
        }}
      >
        WELCOME
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
          color: "#a0a0b0",
          marginBottom: "3rem",
          fontWeight: "300",
          letterSpacing: "0.05em",
        }}
      >
        Access Granted • System Online
      </p>

      {/* Time and date display */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "3rem",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontFamily: "monospace",
            fontWeight: "bold",
            color: "#00ffff",
            marginBottom: "0.5rem",
          }}
        >
          {formatTime(currentTime)}
        </div>
        <div
          style={{
            fontSize: "1rem",
            color: "#40e0d0",
            fontWeight: "300",
          }}
        >
          {formatDate(currentTime)}
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onTryMeClick}
          style={{
            background: "linear-gradient(45deg, #40e0d0, #8a2be2)",
            border: "none",
            borderRadius: "50px",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "#ffffff",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 32px rgba(64, 224, 208, 0.3)",
            minWidth: "150px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 12px 40px rgba(64, 224, 208, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px rgba(64, 224, 208, 0.3)";
          }}
        >
          Try Me! 🎈
        </button>

        <button
          onClick={onLogout}
          style={{
            background: "transparent",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "50px",
            padding: "1rem 2rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            color: "#ffffff",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
            minWidth: "150px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Logout
        </button>
      </div>

      {/* Status indicator */}
      <div
        style={{
          marginTop: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          fontSize: "0.9rem",
          color: "#40e0d0",
        }}
      >
        <div
          className="pulse-animation"
          style={{
            width: "8px",
            height: "8px",
            background: "#40e0d0",
            borderRadius: "50%",
          }}
        />
        System Status: Operational
      </div>
    </div>
  );
}
