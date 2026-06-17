import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { AuthContext } from '../context/AuthContext';
import AuthorPostCard from '../components/AuthorPostCard';
import Modal from '../components/Modal';

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModalPostId, setDeleteModalPostId] = useState(null);

    useEffect(() => {
        apiFetch('/posts/me')
            .then(data => setPosts(data.posts || []))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleTogglePublish = async (post) => {
        // Optimistic UI update so it feels instant
        setPosts(posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p));
        try {
            await apiFetch(`/posts/${post.id}/publish`, { method: 'PATCH' });
        } catch {
            // Revert on failure
            setPosts(posts.map(p => p.id === post.id ? { ...p, published: post.published } : p));
        }
    };

    const handleConfirmDelete = async () => {
        const id = deleteModalPostId;
        setDeleteModalPostId(null);
        try {
            await apiFetch(`/posts/${id}`, { method: 'DELETE' });
            setPosts(posts.filter(p => p.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-serif font-black text-text-primary mb-2">Dashboard</h1>
                    <p className="text-xl text-text-secondary">Welcome back, {user?.username}.</p>
                </div>
                <Link to="/posts/new" className="px-8 py-3 bg-text-primary text-surface font-semibold rounded-full hover:bg-accent transition-colors shrink-0 text-center">
                    + New Post
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-24 text-text-secondary">Loading posts...</div>
            ) : posts.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-border rounded-xl text-text-secondary">
                    <p className="text-lg mb-4">No posts yet.</p>
                    <Link to="/posts/new" className="text-accent hover:underline font-semibold">Write your first post →</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <AuthorPostCard 
                            key={post.id} 
                            post={post} 
                            onDelete={(id) => setDeleteModalPostId(id)}
                            onTogglePublish={handleTogglePublish}
                        />
                    ))}
                </div>
            )}

            <Modal 
                isOpen={!!deleteModalPostId}
                onClose={() => setDeleteModalPostId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
            />
        </div>
    );
}