import React from 'react';

const PostCard = ({ title = "Post", imageUrl }) => {
    // Placeholder landscape image
    const placeholderImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop";

    return (
        <div className="bg-[#6b6b6b] dark:bg-[#4a4a4a] rounded-3xl p-4 flex flex-col gap-4">
            {/* Post Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8a8a8a] dark:bg-[#5a5a5a]"></div>
                <div className="flex-1 bg-[#f0f0f0] rounded-full px-4 py-2">
                    <span className="text-gray-600 font-medium">{title}</span>
                </div>
            </div>

            {/* Post Image */}
            <div className="rounded-lg overflow-hidden border-4 border-[#8a8a8a] dark:border-[#5a5a5a]">
                <img
                    src={imageUrl || placeholderImage}
                    alt={title}
                    className="w-full h-48 object-cover"
                />
            </div>
        </div>
    );
};

export default PostCard;
