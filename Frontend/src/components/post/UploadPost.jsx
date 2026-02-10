import React, { useState, useRef, useEffect } from "react";
import { X, Image, Send, Globe } from "lucide-react";
import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
} from "../../assets/Avatars";

// Avatar mapping - keys match database values
const avatarMap = {
  Avatar1: Avatar1,
  Avatar2: Avatar2,
  Avatar3: Avatar3,
  Avatar4: Avatar4,
  Avatar5: Avatar5,
};

// Compact inline component (what user sees on the page)
function UploadPostCompact({ onClick }) {
  const [user, setUser] = useState({ name: "", username: "", avatar: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const avatarImage = avatarMap[userData.avatar] || Avatar1;
        setUser({
          name: userData.name || "User",
          username: userData.username || "username",
          avatar: avatarImage,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-900 rounded-xl p-3 cursor-pointer 
             hover:bg-neutral-50 dark:hover:bg-neutral-800/50 
             transition-colors border border-neutral-200 dark:border-neutral-800"
    >
      {/* Avatar + Placeholder */}
      <div className="flex items-center gap-2">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full 
                      bg-gradient-to-br from-blue-500 to-purple-600 
                      flex items-center justify-center 
                      text-white font-semibold text-xs"
          >
            {getInitials(user.name || "U")}
          </div>
        )}

        <span className="text-neutral-400 dark:text-neutral-500 text-base">
          Start writing...
        </span>
      </div>

      {/* Share Something (compact) */}
      <div className="flex items-center gap-1.5 mt-2 ml-10">
        <Globe className="w-4 h-4 text-blue-500" />
        <span className="text-blue-500 text-sm font-medium">
          Share Something
        </span>
      </div>

      {/* Divider + Toolbar */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 mt-2 pt-2 ml-10">
        <div className="flex items-center justify-between">
          <button className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <Image className="w-5 h-5 text-blue-500" />
          </button>

          <button
            className="px-4 py-1.5 bg-neutral-300 dark:bg-neutral-700 
                   text-neutral-500 dark:text-neutral-400 rounded-full 
                   font-medium text-sm cursor-not-allowed"
            disabled
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

// Full modal component (opens when compact is clicked)
function UploadPostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState({ name: "", username: "", avatar: "" });
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 2;
  const MAX_CONTENT_LENGTH = 200;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const username = userData.username ? userData.username : "username";
        const avatarImage = avatarMap[userData.avatar] || Avatar1;

        setUser({
          name: userData.name || "User",
          username: username,
          avatar: avatarImage,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [...prev, { file, preview: e.target.result }]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const photoUrls = images.map((img) => img.preview);

      const response = await fetch(
        "http://localhost:5000/api/user/post/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: content.trim(),
            photos: photoUrls,
            isPublic: true,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setContent("");
        setImages([]);
        if (onSubmit) onSubmit(data.post);
        if (onClose) onClose();
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-[600px] rounded-2xl max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header with User Info */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          {/* User Info */}
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-neutral-200 dark:ring-neutral-700">
                {getInitials(user.name || "U")}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                {user.name || "User"}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                @{user.username || "username"}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Text Input */}
          <textarea
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CONTENT_LENGTH) {
                setContent(e.target.value);
              }
            }}
            placeholder="Start writing..."
            className="w-full min-h-[150px] bg-transparent text-neutral-800 dark:text-neutral-100 text-lg placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none focus:outline-none leading-relaxed"
            autoFocus
          />

          {/* Character Count */}
          <div className="text-right text-sm text-neutral-400 dark:text-neutral-500 mb-4">
            {content.length}/{MAX_CONTENT_LENGTH}
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              {images.map((img, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 rounded-b-2xl">
          {/* Image Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${
              images.length >= MAX_IMAGES
                ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200"
            }`}
          >
            <Image className="w-5 h-5" />
            <span className="text-sm">Image</span>
            {images.length > 0 && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                ({images.length}/{MAX_IMAGES})
              </span>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!content.trim() && images.length === 0)}
            className={`px-6 py-2.5 rounded-full transition-all font-semibold text-sm ${
              isSubmitting || (!content.trim() && images.length === 0)
                ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed"
                : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-black dark:hover:bg-neutral-100 shadow-lg"
            }`}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component that combines both
function UploadPost({ onSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <UploadPostCompact onClick={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <UploadPostModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={(post) => {
            setIsModalOpen(false);
            if (onSubmit) onSubmit(post);
          }}
        />
      )}
    </>
  );
}

export default UploadPost;
export { UploadPostCompact, UploadPostModal };
