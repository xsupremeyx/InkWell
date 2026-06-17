import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { AuthContext } from '../context/AuthContext';
import CommentItem from '../components/CommentItem';

export default function PostDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState(null);

    useEffect(() => {
        Promise.all([
            apiFetch(`/posts/${id}`),
            apiFetch(`/posts/${id}/comments`).catch(() => ({ comments: [] }))
        ])
            .then(([postData, commentsData]) => {
                setPost(postData.post);
                setComments(commentsData.comments || []);
            })
            .catch((err) => {
                const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to load post';
                setError(errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setCommentError(null);
        setIsSubmitting(true);

        try {
            const data = await apiFetch(`/posts/${id}/comments`, {
                method: 'POST',
                body: JSON.stringify({ content: newComment }),
            });

            setComments([data.comment, ...comments]);
            setNewComment(''); 
        } catch (err) {
            const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to post comment';
            setCommentError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCommentUpdate = (updatedComment) => {
        setComments(comments.map(c => c.id === updatedComment.id ? updatedComment : c));
    };

    const handleCommentDelete = (deletedCommentId) => {
        setComments(comments.filter(c => c.id !== deletedCommentId));
    };

    if (loading) {
        return <div className="text-center py-24 text-text-secondary">Loading article...</div>;
    }

        if (error || !post) {
        return (
            <div className="max-w-3xl mx-auto py-32 px-6 text-center flex flex-col items-center justify-center min-h-[50vh]">
                <span className="text-accent/20 mb-8">
                    <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </span>
                <h2 className="text-5xl font-serif font-black text-text-primary mb-4 tracking-tight">Post Unavailable</h2>
                <p className="text-xl text-text-secondary mb-10 max-w-md">
                    {error || "We couldn't find the article you were looking for. It may have been moved or deleted."}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-text-primary text-surface rounded-full text-sm font-semibold hover:bg-accent transition-colors"
                >
                    <span aria-hidden="true">&larr;</span> Return Home
                </Link>
            </div>
        );
    }

    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    return (
        // 🚨 Here is where we added the padding and max-width back!
        <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            
            <Link
                to="/"
                className="group inline-flex items-center gap-2 mb-12 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
                <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">&larr;</span> 
                Back to posts
            </Link>

            <header className="mb-12 border-b border-border pb-10">
                {/* 🚨 Upgraded to font-serif and slightly larger sizes */}
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="text-text-secondary flex items-center gap-2 text-lg">
                    <span>By <span className="font-semibold text-text-primary">{post.author?.username || 'Unknown'}</span></span>
                    <span className="text-sm">●</span>
                    <time className="italic">{formattedDate}</time>
                </div>
            </header>

            <div className="max-w-none text-text-primary whitespace-pre-wrap leading-relaxed">
                {post.content}
            </div>

            <hr className="my-16 border-border" />

            <section>
                <div className="flex items-center gap-3 mb-8">
                    <h3 className="text-3xl font-serif font-bold text-text-primary">
                        Comments
                    </h3>
                    {/* Nice pill-badge for the comment count */}
                    <span className="bg-accent/10 text-accent font-semibold px-3 py-1 rounded-full text-sm">
                        {comments.length}
                    </span>
                </div>

                {user ? (
                    <form onSubmit={handleCommentSubmit} className="mb-12 bg-surface border border-border p-6 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                        {commentError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
                                {commentError}
                            </div>
                        )}

                        <textarea
                            className="w-full px-4 py-3 bg-transparent border-none rounded-md focus:outline-none focus:ring-0 mb-3 min-h-25 resize-y text-lg placeholder:text-gray-400"
                            placeholder="What are your thoughts?"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                        <div className="flex justify-end border-t border-border pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="bg-text-primary text-surface px-8 py-2.5 rounded-full font-medium hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-12 bg-background border border-border p-8 rounded-xl text-center text-text-secondary">
                        Please <Link to="/login" className="text-accent hover:underline font-semibold">log in</Link> to join the conversation.
                    </div>
                )}

                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-text-secondary text-center py-8 italic text-lg">No comments yet. Be the first!</p>
                    ) : (
                        comments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} onUpdate={handleCommentUpdate} onDelete={handleCommentDelete}/>
                        ))
                    )}
                </div>
            </section>
        </article>
    );
}