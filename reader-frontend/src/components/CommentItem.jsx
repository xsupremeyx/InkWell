import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api/client';

export default function CommentItem({ comment, onUpdate, onDelete }) {
  const { user } = useContext(AuthContext);
  
  // Check if the currently logged-in user owns this comment
  const isOwner = user && user.id === comment.userId;

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleDelete = async () => {
    // Standard browser confirmation dialog before deleting!
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await apiFetch(`/comments/${comment.id}`, { method: 'DELETE' });
      onDelete(comment.id); // Tell parent to remove it from the screen
    } catch (err) {
      alert(err.errors?.[0]?.message || 'Failed to delete comment');
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false); // No changes made, just close the edit box
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = await apiFetch(`/comments/${comment.id}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent }),
      });
      
      onUpdate(data.comment); // Tell parent to update the text on the screen
      setIsEditing(false);    // Close the edit box
    } catch (err) {
      setError(err.errors?.[0]?.message || 'Failed to update comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="font-semibold text-text-primary mr-3">{comment.user?.username || 'Unknown'}</span>
          <span className="text-xs text-text-secondary">{formattedDate}</span>
          {comment.createdAt !== comment.updatedAt && (
            <span className="text-xs text-text-secondary italic ml-2">(edited)</span>
          )}
        </div>
        
        {/* Only show Edit/Delete if it belongs to the logged in user, and we aren't currently editing */}
        {isOwner && !isEditing && (
          <div className="flex items-center gap-3 text-sm">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-text-secondary hover:text-accent transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="text-text-secondary hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded mb-3 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Toggle between the Text Area and the standard text display! */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent mb-2 min-h-20"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditContent(comment.content); // Reset text on cancel
              }}
              className="px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveEdit}
              disabled={isSubmitting}
              className="px-4 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-text-primary whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
}