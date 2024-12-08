export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { urls } = req.body;

  if (!urls || !Array.isArray(urls)) {
    return res
      .status(400)
      .json({ error: "Invalid input. Please provide an array of URLs." });
  }

  try {
    // Replace this with your actual backend API endpoint
    const backendResponse = await fetch("http://localhost:4000/scraper/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
    });

    if (!backendResponse.ok) {
      throw new Error("Failed to fetch media data from backend.");
    }

    const data = await backendResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." });
  }
}
