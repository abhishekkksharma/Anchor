import React, { useState } from "react";
import { resolveAvatar } from "@/utils/avatarHelper";
import { useAuth } from "@/context/AuthContext";
import { Link, Pen, X } from "lucide-react";

function ProfileTop() {
  const { user } = useAuth();
  const userAvatar = resolveAvatar(user?.avatar);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-3xl w-full mx-auto bg-white dark:bg-black rounded-md shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-200">
        {/* Banner Area */}
        <div className="h-32 bg-gray-200 sm:h-48 w-full relative flex items-center justify-center">
          {/* Optional: Add a pattern or image inside the banner here if needed */}
        </div>

        {/* Profile Info Section */}
        <div className="relative px-6 sm:px-8 pb-8">
          {/* Avatar and Top Actions Row */}
          <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
            <div className="relative inline-block">
              {/* Avatar */}
              <img
                onClick={() => setIsImageModalOpen(true)}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800 transition-colors duration-200 cursor-pointer active:scale-95"
                src={userAvatar}
                alt={user?.name || "Avatar"}
              />
            </div>

            {/* Top Right Actions (Link & More) */}
            <div className="flex gap-4 text-gray-400 dark:text-gray-500 mb-2 sm:mb-4">
              <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Link className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Pen className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Name and Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 transition-colors duration-200">
              {user?.name || "User Name"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1 transition-colors duration-200">
              @{user?.username || "username"}
            </p>
          </div>

          {/* Dotted Divider */}
          <hr className="my-6 sm:my-8 border-t-2 border-dotted border-gray-200 dark:border-gray-700 transition-colors duration-200" />

          {/* About Section */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 transition-colors duration-200">
              About
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base transition-colors duration-200">
              {user?.bio ||
                "I'm an independent designer based in Seoul. I partner with brands and startups through Studio Else to create bold, minimal interfaces and meaningful digital experiences."}
            </p>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageModalOpen(false)}
        >
          {/* Modal Content Container */}
          <div
            className="relative flex justify-center max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevents clicking the image from closing the modal
          >
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsImageModalOpen(false)}
              aria-label="Close modal"
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Enlarged Avatar */}
            <img
              src={userAvatar}
              alt={user?.name || "Full size avatar"}
              className="object-contain max-w-full max-h-[85vh] rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileTop;