"use client";

import { useEffect, useState } from "react";
import { fetchMedia } from "./utils/fetchMedia";
import "./styles.css"; // Importing the styles.css file

interface Media {
  id: number;
  url: string;
  type: string;
  sourceUrl: string;
}

export default function Home() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [mediaType, setMediaType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const data = await fetchMedia(page, limit, mediaType, searchQuery);
        setMedia(data.data);
        setTotalPages(Math.ceil(data.total / limit));
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [page, limit, mediaType, searchQuery]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <h1>Media Gallery</h1>

      {/* Filter Section */}
      <div className="filter-container">
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="select"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>

        <input
          type="text"
          placeholder="Search by URL"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
        />
      </div>

      {/* Media Grid */}
      <div className="grid">
        {media.map((item) => (
          <div key={item.id} className="grid-item">
            {item.type === "image" ? (
              <img
                src={item.url}
                alt="Media"
                className="media-image"
              />
            ) : (
              <video controls className="media-video">
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
          className="pagination-button"
        >
          Previous
        </button>

        <button
          onClick={() => setPage((prevPage) => Math.min(prevPage + 1, totalPages))}
          disabled={page === totalPages}
          className="pagination-button"
        >
          Next
        </button>

        <p className="page-info">
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
}
