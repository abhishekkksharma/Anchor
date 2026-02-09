import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/header/navbar';
import UploadPost from '@/components/post/UploadPost';
import Post from '@/components/post/Post';
import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
} from "../assets/Avatars/index";


const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/user/post/allPosts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // console.log(posts);
                
                if (response.ok) {
                    const data = await response.json(); 
                    setPosts(data.posts || []);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);
    
    // Handle new post created
    const handleNewPost = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    return (
        <div className='min-h-screen bg-neutral-50 dark:bg-black'>
            <Navbar />

            {/* Sidebar - Hidden on mobile/tablet */}
            <div className="hidden xl:block">
                <Sidebar />
            </div>

            {/* Main Content Area - Responsive layout */}
            {/* Sidebar: left-60 (240px) + w-64 (256px) + 20px gap = 516px */}
            <main className='min-h-screen pt-24 pb-20 xl:ml-[60px] flex justify-center px-4'>
                <div className='w-full max-w-xl flex flex-col gap-6'>
                    {/* Upload Post */}
                    <UploadPost onSubmit={handleNewPost} />

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-8 text-neutral-500">
                            Loading posts...
                        </div>
                    )}

                    {/* Posts Feed - Empty State */}
                    {!loading && posts.length === 0 && (
                        <div className="text-center py-8 text-neutral-500">
                            No posts yet. Be the first to share something!
                        </div>
                    )}

                    {/* Map Posts */}
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;
