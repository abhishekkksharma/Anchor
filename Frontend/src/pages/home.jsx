import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/header/navbar';
import UploadPost from '@/components/post/UploadPost';
import Post from '@/components/post/Post';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const fetchingRef = useRef(false);

    const fetchPosts = async (pageNum) => {
        if (fetchingRef.current || loading) return;
        if (!hasMore && pageNum > 1) return;

        fetchingRef.current = true;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `http://localhost:5000/user/post/allPosts?page=${pageNum}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                const newPosts = data.posts || [];

                setPosts(prev => {
                    if (pageNum === 1) {
                        return newPosts;
                    }

                    const existingIds = new Set(prev.map(p => p._id));
                    const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p._id));

                    return [...prev, ...uniqueNewPosts];
                });

                if (pageNum >= data.totalPages || newPosts.length === 0) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
            fetchingRef.current = false;
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading && !fetchingRef.current) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchPosts(nextPage);
                        return nextPage;
                    });
                }
            },
            {
                threshold: 0.1,
                rootMargin: "100px",
            }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMore, loading]);

    const handleNewPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    return (
        <div className='min-h-screen bg-neutral-50 dark:bg-black'>
            <Navbar />

            {/* Sidebar - now always rendered (handles its own responsive behavior) */}
            <Sidebar />

            {/* Main content - adjusted margins for sidebar */}
            <main className='min-h-screen pt-22 pb-20 xl:ml-20 flex justify-center px-4'>
                <div className='w-full max-w-xl flex flex-col gap-6'>

                    {/* Create Post */}
                    <UploadPost onSubmit={handleNewPost} />

                    {/* Posts Feed */}
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}

                    {/* Infinite scroll loader */}
                    <div ref={loaderRef} className="flex items-center justify-center w-full py-4">
                        {loading && (
                            <div className="text-neutral-500 text-sm">
                                Loading more posts...
                            </div>
                        )}
                    </div>

                    {/* End of Feed */}
                    {!hasMore && posts.length > 0 && (
                        <div className="text-center py-4 text-neutral-500 text-sm">
                            No more posts to show.
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && posts.length === 0 && !initialLoad && (
                        <div className="text-center py-8 text-neutral-500">
                            No posts yet. Be the first to share something!
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;