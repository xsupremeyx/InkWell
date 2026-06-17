import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import Modal from '../components/Modal';

export default function PostComments() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModalCommentId, setDeleteModalCommentId] = useState(null);

    useEffect(() => {
        Promise.all([
            apiFetch(`/posts/me/${id}`),
            apiFetch(`/posts/${id}/comments`).catch(() => ({ comments: [] }))
        ])
        .then(([postData, commentsData]) => {
            setPost(postData.post);
            setComments(commentsData.comments || []);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, [id]);

    const handleConfirmDelete = async () => {
        const commentId = deleteModalCommentId;
        setDeleteModalCommentId(null);
        try {
            await apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-center py-24 text-text-secondary">Loading comments...</div>;
    if (!post) return <div className="text-center py-24 text-red-600">Post not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <Link to="/" className="group inline-flex items-center gap-2 mb-8 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> 
                Back to Dashboard
            </Link>

            <h1 className="text-3xl font-serif font-black text-text-primary mb-2">Moderation</h1>
            <p className="text-lg text-text-secondary mb-12">
                Comments on: <span className="font-serif italic text-text-primary">"{post.title}"</span>
            </p>
            {/* ADD THIS BLOCK right here */}
            {!post.published && (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-lg mb-8 text-sm border border-amber-200">
                    ⚠️ This post is a <strong>draft</strong>. Comment moderation is only available on published posts.
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {comments.length === 0 ? (
                <div className="text-center py-24 border border-dashed border-border rounded-xl text-text-secondary">
                    <p className="text-lg">No comments on this post yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map(comment => (
                        <div key={comment.id} className="bg-surface border border-border p-6 rounded-xl flex justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-semibold text-text-primary">{comment.user?.username}</span>
                                    <span className="text-sm text-text-secondary italic">
                                        • {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-text-primary leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            </div>
                            <button
                                onClick={() => setDeleteModalCommentId(comment.id)}
                                className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors shrink-0 cursor-pointer px-4 py-2 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Modal 
                isOpen={!!deleteModalCommentId}
                onClose={() => setDeleteModalCommentId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Comment"
                message="Are you sure you want to delete this comment? This action cannot be undone."
            />
        </div>
    );
}