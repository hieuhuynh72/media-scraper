// utils/fetchMedia.ts
export async function fetchMedia(
  page: number,
  limit: number,
  type: string,
  search: string
) {
  const url = new URL("http://localhost:4000/scraper/media");
  const params = new URLSearchParams();

  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (type) params.append("type", type);
  if (search) params.append("search", search);

  const res = await fetch(`${url}?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch media");
  }
  return await res.json();
}

export const fetchMediaFromUrls = async (urls: string[]) => {
  try {
    const response = await fetch("http://localhost:3000/scraper/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch media.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Error fetching media: " + error);
  }
};
