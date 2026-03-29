import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Loader2, User, Mail, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAvatarUpload from "@/hooks/useAvatarUpload";
import { useAuth } from "@/context/AuthContext";
import { resolveAvatar } from "@/utils/avatarHelper";
import { API_URL } from "@/config/api";
import { usePopup } from "@/context/PopupContext";

function EditProfileModal({ isOpen, onClose, inline = false }) {
  const { user, login, token } = useAuth();
  const { uploadAvatar, isUploading } = useAvatarUpload();
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    about: user?.about || "",
  });

  // Local preview shown in the UI (objectURL or the existing avatar URL)
  const [previewAvatar, setPreviewAvatar] = useState(resolveAvatar(user?.avatar));
  // Raw File waiting to be uploaded — null means no new image has been picked
  const [pendingFile, setPendingFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const photoMenuRef = useRef(null);
  // Track the active objectURL so we can revoke it when done
  const previewUrlRef = useRef(null);

  const revokePreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  // Reset everything when the modal opens
  useEffect(() => {
    if (isOpen || inline) {
      setFormData({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        about: user?.about || "",
      });
      setPreviewAvatar(resolveAvatar(user?.avatar));
      setPendingFile(null);
      revokePreviewUrl();
    }
  }, [isOpen, inline, user]);

  // Cleanup objectURL on unmount
  useEffect(() => () => revokePreviewUrl(), []);

  // Close photo menu on outside click
  useEffect(() => {
    if (!showPhotoMenu) return;
    const handler = (e) => {
      if (photoMenuRef.current && !photoMenuRef.current.contains(e.target)) {
        setShowPhotoMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPhotoMenu]);

  if (!isOpen && !inline) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Stage a new file locally — NO Cloudinary upload yet
  const stageFile = (file) => {
    if (!file) return;
    revokePreviewUrl();
    const localUrl = URL.createObjectURL(file);
    previewUrlRef.current = localUrl;
    setPreviewAvatar(localUrl);
    setPendingFile(file);
    setShowPhotoMenu(false);
  };

  const handleFileChange = (e) => {
    stageFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleCameraCapture = (e) => {
    stageFile(e.target.files[0]);
    e.target.value = "";
  };

  const handleImageClick = () => setShowPhotoMenu((v) => !v);

  // Cancel: discard pending file and revert the preview
  const handleCancel = () => {
    setPendingFile(null);
    revokePreviewUrl();
    setPreviewAvatar(resolveAvatar(user?.avatar));
    onClose();
  };

  // Save: upload to Cloudinary ONLY now, then patch the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalAvatarUrl = user?.avatar || "";

      if (pendingFile) {
        // This is the only place uploadAvatar (Cloudinary) is called
        finalAvatarUrl = await uploadAvatar(pendingFile);
      }

      const payload = { ...formData, avatar: finalAvatarUrl };

      const res = await fetch(`${API_URL}/user/updateData`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", res.status, text);
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      if (res.ok) {
        showPopup("Profile updated successfully!", "success");
        setPendingFile(null);
        revokePreviewUrl();

        const oldUsername = user.username;
        const newUsername = data.userData.username;
        login(data.userData, token);

        if (!inline) {
          setTimeout(() => {
            onClose();
            if (oldUsername !== newUsername) navigate(`/profile/${newUsername}`);
          }, 500);
        }
      } else {
        throw new Error(data?.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      showPopup(err.message || "Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isUploading;

  const content = (
    <div
      className={
        inline
          ? "w-full"
          : "bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      }
      onClick={(e) => !inline && e.stopPropagation()}
    >
      {/* Header */}
      {!inline && (
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className={inline ? "py-2 w-full max-w-lg" : "p-6 overflow-y-auto custom-scrollbar"}>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Avatar */}
          <div className={`flex flex-col ${inline ? "items-start" : "items-center"}`}>
            <div className="relative" ref={photoMenuRef}>
              <div
                className="relative group cursor-pointer"
                onClick={handleImageClick}
                title="Change profile photo"
              >
                <img
                  src={previewAvatar}
                  alt="Profile"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-sm group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <Camera className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Badge shown when a new image is staged but not yet saved */}
              {pendingFile && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap border border-amber-200 dark:border-amber-700">
                  Not saved yet
                </span>
              )}

              {/* Photo source menu */}
              {showPhotoMenu && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 top-full z-10 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => { setShowPhotoMenu(false); cameraInputRef.current?.click(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-blue-500 shrink-0" />
                    Take a photo
                  </button>
                  <div className="border-t border-gray-100 dark:border-zinc-700" />
                  <button
                    type="button"
                    onClick={() => { setShowPhotoMenu(false); fileInputRef.current?.click(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-blue-500 shrink-0" />
                    Upload from device
                  </button>
                </div>
              )}

              {/* Hidden inputs — no upload happens here */}
              <input type="file" ref={fileInputRef} className="hidden"
                accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
              <input type="file" ref={cameraInputRef} className="hidden"
                accept="image/*" capture="user" onChange={handleCameraCapture} />
            </div>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
              Change Profile Photo
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow"
                  placeholder="Enter your name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">@</span>
                </div>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow"
                  placeholder="choose_username" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow"
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About / Bio</label>
              <textarea name="about" rows={4} value={formData.about} onChange={handleInputChange}
                className="block w-full p-3 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none transition-shadow resize-none"
                placeholder="Tell us a little bit about yourself..." />
            </div>
          </div>

          {/* Actions */}
          <div className={`pt-4 flex gap-3 ${inline ? "mt-4" : "justify-end border-t border-gray-100 dark:border-zinc-800 mt-6"}`}>
            {!inline && (
              <button type="button" onClick={handleCancel} disabled={isBusy}
                className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                Cancel
              </button>
            )}
            <button type="submit" disabled={isBusy}
              className={`px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${inline ? "w-full md:w-auto" : ""}`}>
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      {content}
    </div>
  );
}

export default EditProfileModal;