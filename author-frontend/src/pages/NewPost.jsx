import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { Editor } from '@tinymce/tinymce-react';

// TinyMCE Self-hosted imports
import 'tinymce/tinymce';
import 'tinymce/models/dom/model';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';

// Add these right below your other plugin imports:
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/codesample';

// CSS for TinyMCE so it doesn't try to fetch them from the cloud!
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/content/default/content.min.css';

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSave = async (isPublished) => {
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await apiFetch('/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    content,
                    published: isPublished
                })
            });
            navigate('/');
        } catch (err) {
            setError(err.errors?.[0]?.message || err.message || 'Failed to save post');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
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
                    initialValue=""
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
                    onClick={() => handleSave(false)}
                    disabled={loading}
                    className="px-8 py-3 bg-transparent border border-border text-text-secondary font-semibold rounded-full hover:border-text-primary hover:text-text-primary transition-colors disabled:opacity-50 cursor-pointer"
                >
                    Save as Draft
                </button>
                <button
                    onClick={() => handleSave(true)}
                    disabled={loading}
                    className="px-8 py-3 bg-text-primary text-surface font-semibold rounded-full hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Saving...' : 'Publish'}
                </button>
            </div>
        </div>
    );
}