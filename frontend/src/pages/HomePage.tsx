import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to Electronic Arts</h1>
      <p>Your gateway to the EA universe.</p>
      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/login")}>Login</button>
        <button
          onClick={() => navigate("/register")}
          style={{ marginLeft: "1rem" }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
