import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Flag, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function PostMoreOptions({ postId, authorId, onDelete }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { user, token } = useAuth();

    const isOwner = user && (user.id === authorId || user._id === authorId);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleReport = async () => {
        try {
            const res = await fetch(`http://localhost:5000/user/post/${postId}/report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                alert('Post reported successfully.');
            } else {
                alert('Failed to report post.');
            }
        } catch (err) {
            console.error('Error reporting post:', err);
            alert('Something went wrong.');
        }
        setIsOpen(false);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`http://localhost:5000/user/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                onDelete?.(postId);
            } else {
                alert('Failed to delete post.');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Something went wrong.');
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
                <MoreHorizontal className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1">
                    {/* Report */}
                    <button
                        onClick={handleReport}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <Flag className="w-4 h-4" />
                        Report
                    </button>

                    {/* Delete — only for the post owner */}
                    {isOwner && (
                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Post
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default PostMoreOptions;
