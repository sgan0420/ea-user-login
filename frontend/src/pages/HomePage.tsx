import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Electronic Arts</h1>
      <p>Your portal to user registration and login.</p>
      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/login")}
          style={{ marginRight: "1rem" }}
        >
          Login
        </button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}
