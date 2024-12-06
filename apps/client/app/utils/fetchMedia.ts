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
  