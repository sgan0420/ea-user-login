export default function LoginPage() {
  return (
    <form>
      <h2>Login</h2>
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
  );
}
