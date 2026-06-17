import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { AuthContext } from '../context/AuthContext';
import CommentItem from '../components/CommentItem';

export default function PostDetail() {
    const { id } = useParams();

    // We need to know if the user is logged in to show the comment form!
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentError, setCommentError] = useState(null);

    useEffect(() => {
        // Fetch both the post AND the comments concurrently
        Promise.all([
            apiFetch(`/posts/${id}`),
            apiFetch(`/posts/${id}/comments`).catch(() => ({ comments: [] })) // If comments fail, don't crash
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

            // Add the new comment to the top of our local state array immediately
            setComments([data.comment, ...comments]);
            setNewComment(''); // Clear the text box
        } catch (err) {
            const errorMessage = err.errors?.[0]?.message || err.message || 'Failed to post comment';
            setCommentError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCommentUpdate = (updatedComment) => {
        // Replace the old comment with the updated one in our array
        setComments(comments.map(c => c.id === updatedComment.id ? updatedComment : c));
    };

    const handleCommentDelete = (deletedCommentId) => {
        // Filter out the deleted comment from our array
        setComments(comments.filter(c => c.id !== deletedCommentId));
    };

    if (loading) {
        return <div className="text-center py-20 text-text-secondary">Loading article...</div>;
    }

    if (error || !post) {
        return (
            <div className="max-w-2xl mx-auto py-20 text-center flex flex-col items-center">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Oops!</h2>
                <p className="text-red-600 bg-red-50 p-4 rounded-md inline-block border border-red-200 mb-6">
                    {error || 'Post not found.'}
                </p>

                {/* Preserved your nicely styled 404 Back Button! */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-surface border border-border rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 hover:shadow-sm transition-all w-max mx-auto"
                >
                    <span aria-hidden="true">&larr;</span> Back to Home
                </Link>
            </div>
        );
    }

    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    return (
        <article className="max-w-3xl mx-auto py-8">
            {/* Preserved your nicely styled standard Back Button! */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-surface border border-border rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 hover:shadow-sm transition-all w-max"
            >
                <span aria-hidden="true">&larr;</span> Back to posts
            </Link>

            <header className="mb-10 border-b border-border pb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="text-text-secondary flex items-center gap-2">
                    <span>By <span className="font-medium text-text-primary">{post.author?.username || 'Unknown'}</span></span>
                    <span>•</span>
                    <time>{formattedDate}</time>
                </div>
            </header>

            <div className="prose prose-lg max-w-none text-text-primary whitespace-pre-wrap leading-relaxed">
                {post.content}
            </div>

            <hr className="my-12 border-border" />

            {/* --- COMMENTS SECTION --- */}
            <section>
                <h3 className="text-2xl font-bold text-text-primary mb-6">
                    Comments ({comments.length})
                </h3>

                {/* The Comment Form */}
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="mb-10 bg-surface border border-border p-5 rounded-lg shadow-sm">
                        {commentError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
                                {commentError}
                            </div>
                        )}

                        <textarea
                            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent mb-3 min-h-25 resize-y"
                            placeholder="What are your thoughts?"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="bg-accent text-white px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-10 bg-gray-50 border border-border p-6 rounded-lg text-center text-text-secondary">
                        Please <Link to="/login" className="text-accent hover:underline font-medium">log in</Link> to leave a comment.
                    </div>
                )}

                {/* The Comments List */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-text-secondary text-center py-6 italic">No comments yet. Be the first!</p>
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