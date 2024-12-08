/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [urls, setUrls] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState<string>('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const urlArray = urls.split('\n').map((url) => url.trim());
    setMedia([]);
    setLoading(true);
    setError('');

    try {
      // Send URLs to the backend
      const response = await fetch('http://localhost:4000/scraper/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ urls: urlArray }),
      });

      const data = await response.json();
      if (response.ok) {
        fetchMedia({ page: 1, type: mediaType })
        // setMedia(data.media);  // Assuming media data is returned in a `media` field
      } else {
        setError(data.message || 'Error fetching media data');
      }
    } catch (err: any) {
      setError('An error occurred while fetching media data' + err);
    }

    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMedia = async ({ page, type }: { page: number, type: string | null }) => {
    try {
      const body: any = {
        urls: urls.split('\n'),
        page,
      }
      if (type) {
        body.type = type;
      }
      const response = await fetch('http://localhost:4000/scraper/medias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        if (page === 1) {
          setMedia(data.data);
        } else {
          setMedia([...media, ...data.data] as any);
        }
      } else {
        setError(data.message || 'Error fetching media data');
      }
    } catch (err) {
      setError('An error occurred while fetching media data' + err);
    }
  }

  const onLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    fetchMedia({ page: newPage, type: mediaType });
  }

  useEffect(() => {
    // Check for JWT token in localStorage or cookies
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login'; // Redirect to login if not authenticated
    }
  }, []);

  useEffect(() => {
    let longPolling = null;
    if (urls && !media.length) {
      longPolling = setInterval(() => fetchMedia({ page: 1, type: mediaType }), 5000); // Fetch media every 5 seconds
    }
    return () => { if (longPolling) clearInterval(longPolling) };
  }, [urls, media, mediaType, fetchMedia]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Enter URLs to Fetch Media</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="Enter URLs separated by new lines"
          rows={4}
          cols={50}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className='flex'>
          <label
            id="listbox-label"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Filter by Media Type
          </label>
          <select
            value={mediaType}
            onChange={(e) => { setMediaType(e.target.value); setPage(1); }}
            className="select"
            style={{ marginLeft: 20 }}
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-md disabled:bg-blue-300"
          >
            {loading ? 'Fetching Media...' : 'Search'}
          </button>
        </div>
      </form>
      {media.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Media Data</h3>
          <div className="grid grid-cols-4 gap-4">
            {media.map((item: any, index) => (
              <div key={index}>
                {item.type === 'image' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url}
                    alt="Media"
                    className="w-full h-48 object-cover mt-2"
                    style={{ width: 150, height: 150 }}
                  />
                )}
                {item.type === 'video' && (
                  <video
                    controls
                    src={item.url}
                    className="w-full h-48 object-cover mt-2"
                    style={{ width: 150, height: 150 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {media.length > 0 && (<div className="flex justify-center" style={{ marginTop: 20 }}>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-md disabled:bg-blue-300"
          onClick={onLoadMore}
        >
          Load more
        </button>
      </div>)}
    </div>
  );
};

export default Dashboard;
