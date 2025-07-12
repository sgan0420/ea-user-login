interface UserInfoProps {
  user: any;
  onLogout: () => void;
}

export default function UserInfo({ user, onLogout }: UserInfoProps) {
  if (!user) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "15px",
        padding: "12px 20px",
        zIndex: 20,
        minHeight: "40px",
      }}
    >
      <span
        style={{
          color: "#a0a0b0",
          fontSize: "0.9rem",
          lineHeight: "1.2",
          margin: "0",
          padding: "0",
        }}
      >
        {user.username} ({user.email})
      </span>
      <button
        onClick={onLogout}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          color: "#ffffff",
          padding: "8px 16px",
          cursor: "pointer",
          fontSize: "0.8rem",
          transition: "all 0.3s ease",
          lineHeight: "1.2",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
        }}
      >
        Logout
      </button>
    </div>
  );
}
