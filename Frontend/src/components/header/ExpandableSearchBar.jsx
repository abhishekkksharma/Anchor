import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { API_URL } from "@/config/api";
import { resolveAvatar } from "../../utils/avatarHelper";

function ExpandableSearchBar() {
  const inputRef = useRef(null);
  const { isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSearch = () => {
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setIsOpen(false);
      setQuery("");
      setResults([]);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/user/profiles/${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await response.json();

        if (json.success && json.data) {
          setResults(json.data);
          console.log(json.data);
        } else if (Array.isArray(json)) {
          setResults(json);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const UserSkeleton = () => (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#2a2a2a] shrink-0"></div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-24 bg-gray-200 dark:bg-[#2a2a2a] rounded"></div>
        <div className="h-2 w-16 bg-gray-200 dark:bg-[#2a2a2a] rounded"></div>
      </div>
    </div>
  );

  return (
    <>
      {isAuthenticated && (
        <div
          className={`transition-all duration-300 flex flex-col justify-center z-50 ${
            isOpen
              ? "absolute left-4 right-4 sm:relative sm:left-auto sm:right-auto"
              : "relative"
          }`}
        >
          <div
            className={`flex items-center border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-[#1e1e1e] shadow-sm transition-all duration-300 ease-in-out px-1 ${
              isOpen ? "w-full sm:w-auto" : ""
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className={`h-9 md:h-10 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 transition-all duration-300 ease-in-out
              ${isOpen ? "w-full sm:w-54 px-3 opacity-100" : "w-0 p-0 opacity-0"}`}
            />

            {/* FIX: Clear Query Button is now always rendered when open, but hidden when query is empty */}
            {isOpen && (
              <button
                onClick={() => setQuery("")}
                className={`p-1 mr-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-opacity duration-200 ${
                  query
                    ? "opacity-100 cursor-pointer"
                    : "opacity-0 pointer-events-none"
                }`}
                tabIndex={query ? 0 : -1} // Prevents tabbing to the invisible button
                aria-hidden={!query}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={toggleSearch}
              className="p-1 lg:p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0 bg-white dark:bg-[#1e1e1e]"
              aria-label={isOpen ? "Collapse Search" : "Expand Search"}
            >
              <Search className="w-5 h-5 stroke-[2.5] text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {isOpen && query.trim() && (
            <div className="absolute top-full right-0 sm:right-auto sm:left-0 mt-2 w-full sm:w-72 max-h-[60vh] overflow-y-auto rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/60 backdrop-blur-xl shadow-lg z-40 flex flex-col py-2 scrollbar-hide">
              {isLoading ? (
                <>
                  <UserSkeleton />
                  <UserSkeleton />
                  <UserSkeleton />
                </>
              ) : results.length > 0 ? (
                results.map((user) => (
                  <Link
                    to={`/profile/${user.username}`}
                    key={user._id}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <img
                      src={
                        resolveAvatar(user.avatar) ||
                        `https://ui-avatars.com/api/?background=random&name=${user.name}`
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-800 bg-gray-100"
                      onError={(e) => {
                        // Failsafe: If the resolved local image STILL fails to load, swap to initials
                        e.target.src = `https://ui-avatars.com/api/?background=random&name=${user.name}`;
                      }}
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        @{user.username}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No users found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ExpandableSearchBar;
