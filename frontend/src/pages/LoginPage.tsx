export default function LoginPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" />
        </div>
        <div>
          <label>Dynamic Code:</label>
          <input type="text" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
