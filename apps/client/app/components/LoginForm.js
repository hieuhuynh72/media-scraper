import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log("handleSubmit");
    e.preventDefault();
    setLoading(true);
    setError("");

    // Send login request to your backend at http://localhost:4000/api/login
    const response = await fetch("http://localhost:4000/api/login", {
      // Update the URL here
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // If login is successful, store the JWT in localStorage
      localStorage.setItem("token", data.access_token);
      // Redirect to the protected route or dashboard
      window.location.href = "/dashboard";
    } else {
      // If login fails, show an error message
      setError(data.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
