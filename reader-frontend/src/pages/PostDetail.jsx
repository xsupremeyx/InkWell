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
        <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">

            <Link
                to="/"
                className="group inline-flex items-center gap-2 mb-12 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
                <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                Back to posts
            </Link>

            <header className="mb-12 border-b border-border pb-10">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-8 leading-tight">
                    {post.title}
                </h1>

                {/* Minimal Avatar Header! */}
                <div className="flex items-center gap-4">
                    <img
                        src="https://github.com/xsupremeyx.png"
                        alt="XSupremeYX"
                        className="w-12 h-12 rounded-full border-2 border-accent shadow-sm"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-text-primary">XSupremeYX</span>
                        <time className="text-sm text-text-secondary italic">{formattedDate}</time>
                    </div>
                </div>
            </header>


            <div 
    className="max-w-none text-text-primary leading-relaxed text-lg md:text-xl 
               [&>p]:mb-6 
               [&_h1]:font-serif [&_h1]:text-4xl [&_h1]:mb-4 [&_h1]:font-bold
               [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:mb-4 [&_h2]:font-bold
               [&_h3]:font-serif [&_h3]:text-2xl [&_h3]:mb-4 [&_h3]:font-bold
               [&_h4]:font-serif [&_h4]:text-xl [&_h4]:mb-3 [&_h4]:font-bold
               [&_h5]:font-serif [&_h5]:text-lg [&_h5]:mb-3 [&_h5]:font-bold
               [&_h6]:font-serif [&_h6]:text-base [&_h6]:mb-3 [&_h6]:font-bold
               [&_strong]:font-bold
               [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 
               [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6
               [&_a]:text-accent hover:[&_a]:underline
               [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:max-w-full [&_iframe]:rounded-lg
               [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg"
    dangerouslySetInnerHTML={{ __html: post.content }}
/>

            {/* Author Bio Card */}
            <div className="mt-20 p-8 bg-surface border border-border rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
                <img
                    src="https://github.com/xsupremeyx.png"
                    alt="XSupremeYX"
                    className="w-24 h-24 rounded-full border-4 border-background shadow-md"
                />
                <div className="text-center sm:text-left flex-1">
                    <h4 className="text-2xl font-serif font-bold text-text-primary mb-2">XSupremeYX</h4>
                    <p className="text-text-secondary mb-4 italic">"Writing things down."</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                        <a href="https://github.com/xsupremeyx" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors flex items-center gap-2 font-medium">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub
                        </a>
                        {/* Space saved for LinkedIn */}
                        {/* Space saved for Personal Website */}
                    </div>
                </div>
            </div>

            <hr className="my-16 border-border" />

            {/* Distinct Comments Section! */}
            <section className="bg-surface/60 border border-border/80 rounded-3xl p-6 md:p-10 shadow-sm relative">
                {/* A subtle absolute gradient just to give the comments box some depth */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/2 rounded-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <h3 className="text-3xl font-serif font-bold text-text-primary">
                            Comments
                        </h3>
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
                                <CommentItem key={comment.id} comment={comment} onUpdate={handleCommentUpdate} onDelete={handleCommentDelete} />
                            ))
                        )}
                    </div>
                </div>
            </section>
        </article>
    );
}