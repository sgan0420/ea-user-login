import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")}>Go Home</button>
    </div>
  );
}
