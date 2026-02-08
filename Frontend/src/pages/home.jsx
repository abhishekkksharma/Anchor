import React from 'react';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import Navbar from '../components/header/navbar';

const Home = () => {
    return (
        <div className='h-screen overflow-hidden dark:bg-black pt-20'>
            <Navbar />

            {/* Sidebar - Fixed Position */}
            <Sidebar />

            {/* Main Content Area - Centered & Scrollable */}
            <main className='h-full overflow-y-auto scrollbar-hide flex justify-center'>
                <div className='w-full max-w-2xl p-6 flex flex-col gap-6'>
                    {/* Post Section 1 */}
                    <PostCard title="Post" />
                    {/* Post Section 2 */}
                    <PostCard title="Post" />
                    <PostCard title="Post" />
                    <PostCard title="Post" />
                </div>
            </main>
        </div>
    );
};

export default Home;
