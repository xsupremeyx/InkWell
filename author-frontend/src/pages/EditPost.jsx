import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { Editor } from '@tinymce/tinymce-react';

import 'tinymce/tinymce';
import 'tinymce/models/dom/model';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/content/default/content.min.css';
// Add these right below your other plugin imports:
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/codesample';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [initialContent, setInitialContent] = useState('');
    const [published, setPublished] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiFetch(`/posts/me/${id}`)
            .then(data => {
                setTitle(data.post.title);
                setContent(data.post.content);
                setInitialContent(data.post.content);
                setPublished(data.post.published);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await apiFetch(`/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ title, content })
            });
            navigate('/');
        } catch (err) {
            setError(err.errors?.[0]?.message || err.message || 'Failed to save post');
            setSaving(false);
        }
    };

    const handleTogglePublish = async () => {
        setSaving(true);
        setError(null);
        try {
            const data = await apiFetch(`/posts/${id}/publish`, { method: 'PATCH' });
            setPublished(data.post.published);
        } catch (err) {
            setError(err.message || 'Failed to toggle publish status');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-24 text-text-secondary">Loading editor...</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-6">
                {published ? (
                    <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-green-100 text-green-700">Published</span>
                ) : (
                    <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-amber-100 text-amber-700">Draft</span>
                )}
                <button
                    onClick={handleTogglePublish}
                    disabled={saving}
                    className="text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                    {published ? 'Unpublish Post' : 'Publish Post'}
                </button>
            </div>

            <div className="mb-8">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title..."
                    className="w-full text-4xl md:text-5xl font-serif font-bold text-text-primary bg-transparent border-none outline-none placeholder:text-border mb-6 resize-none"
                />
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                        {error}
                    </div>
                )}
            </div>

            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm mb-8">
                <Editor
                    initialValue={initialContent}
                    onEditorChange={(newContent) => setContent(newContent)}
                    init={{
                        license_key: 'gpl',
                        height: 600,
                        menubar: false,
                        skin: false,
                        content_css: false,
                        plugins: ['lists', 'link', 'image', 'code', 'fullscreen', 'media', 'table', 'codesample'],
                        toolbar: 'undo redo | bold italic underline | h1 h2 h3 | bullist numlist | link image media table codesample | code | fullscreen',
                        content_style: `
                            body { font-family: Inter, sans-serif; font-size: 18px; color: #1C1409; background: #FFFFFF; line-height: 1.6; padding: 1rem; }
                            h1, h2, h3 { font-family: 'Playfair Display', serif; font-weight: 700; }
                        `
                    }}
                />
            </div>

            {/* Replace your existing bottom div with this: */}
            <div className="flex items-center gap-4 justify-end">
                <Link
                    to="/"
                    className="px-6 py-3 text-text-secondary font-semibold hover:text-text-primary transition-colors cursor-pointer"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-text-primary text-surface font-semibold rounded-full hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}