import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts as soon as the Home page loads
  useEffect(() => {
    // /posts is a public route, so no token is needed, but apiFetch handles it gracefully anyway!
    apiFetch('/posts')
      .then((data) => {
        // Based on your API shape: { message: "...", posts: [...] }
        setPosts(data.posts || []);
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Is the server running?');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty array means run exactly once on mount

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 border-b border-border mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          A space for thoughtful writing.
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Read articles and ideas from independent authors. Built with React and Express.
        </p>
      </section>

      {/* Posts Section (The "Browse Posts" anchor link targets this ID!) */}
      <section id="posts" className="scroll-mt-24">
        <h2 className="text-2xl font-bold text-text-primary mb-8">Latest Posts</h2>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-text-secondary py-12">
            Loading articles...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 text-center border border-red-200">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-text-secondary py-12 border border-dashed border-border rounded-xl">
            No posts found. Tell an author to publish something!
          </div>
        )}

        {/* The Grid (Responsive!) */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}