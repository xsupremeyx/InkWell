import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';
import PostCard from '../components/PostCard';

// ✏️ Change this URL anytime to swap the hero background!
const HERO_IMAGE_URL = '/hero.webp';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts as soon as the Home page loads
  useEffect(() => {
    apiFetch('/posts')
      .then((data) => {
        setPosts(data.posts || []);
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Is the server running?');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleScrollToPosts = () => {
    // This looks for the ID="posts" and smoothly scrolls down to it
    document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* 🚨 CHANGED: FULL SCREEN HERO SECTION */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden bg-gray-900"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
        />
        {/* Dark Gradient Overlay for text legibility */}
        <div className="absolute inset-0 z-0 bg-linear-to-b from-black/70 via-black/40 to-black/80" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto -mt-16">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg px-2">
            A space for thoughtful writing.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium drop-shadow px-4">
            A single pen. Endless pages.
          </p>
          <button
            onClick={handleScrollToPosts}
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-white/80 text-white rounded-full font-medium hover:bg-white hover:text-text-primary transition-all duration-300 cursor-pointer"
          >
            Browse Posts &darr;
          </button>
        </div>
      </section>

      {/* 🚨 CHANGED: POSTS SECTION (Padding and max-width added back here!) */}
      <section id="posts" className="max-w-4xl mx-auto px-6 py-24 scroll-mt-16">
        <h2 className="font-serif text-3xl font-bold text-text-primary mb-10">Latest Edits</h2>

        {loading && (
          <div className="text-center text-text-secondary py-12">
            Loading articles...
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 text-center border border-red-200">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center text-text-secondary py-16 border border-dashed border-border rounded-xl">
            No posts found. Tell an author to publish something!
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}