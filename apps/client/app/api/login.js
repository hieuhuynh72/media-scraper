export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Simulate user validation (replace this with actual validation, e.g., query a database)
    if (username === "admin" && password === "password123") {
      // Simulate JWT creation (replace this with actual JWT signing logic)
      const access_token = "your-jwt-token"; // You would use a JWT library to create this token

      // Respond with the token
      return res.status(200).json({ access_token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  }

  // Handle other request methods
  res.status(405).json({ message: "Method Not Allowed" });
}
