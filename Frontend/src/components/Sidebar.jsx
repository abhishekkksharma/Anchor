import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Home,
    MessageSquare,
    Users,
    Plug,
    Mail,
    Info,
    Menu,
    ChevronFirst,
    ArrowBigLeft
} from "lucide-react";

// Import avatars
import Avatar1 from "../assets/Avatars/Avatar1.png";
import Avatar2 from "../assets/Avatars/Avatar2.png";
import Avatar3 from "../assets/Avatars/Avatar3.png";
import Avatar4 from "../assets/Avatars/Avatar4.png";
import Avatar5 from "../assets/Avatars/Avatar5.png";

const avatarMap = {
    Avatar1,
    Avatar2,
    Avatar3,
    Avatar4,
    Avatar5,
};

const Sidebar = () => {
    const { pathname } = useLocation();
    const { user } = useAuth();

    // Get username and avatar from auth context
    const username = user?.username || user?.name || 'Guest User';
    const userInitial = username.charAt(0).toUpperCase();
    const userAvatar = user?.avatar ? avatarMap[user.avatar] : null;

    // Initialize state from localStorage, default to true
    const [isExpanded, setIsExpanded] = useState(() => {
        const savedState = localStorage.getItem('sidebarExpanded');
        return savedState !== 'false';
    });

    // Save state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarExpanded', isExpanded.toString());
    }, [isExpanded]);

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'News Letter', path: '/newsletter', icon: Mail },
        { name: 'Community', path: '/community', icon: MessageSquare },
        { name: 'Connect', path: '/connect', icon: Users },
        { name: 'Contact', path: '/contact', icon: Plug },
        { name: 'About', path: '/about', icon: Info },
    ];

    return (
        <aside
            className={`fixed top-20 left-60 pb-10 bg-white/10 dark:bg-black/40 backdrop-blur-lg border border-white/20 dark:border-gray-800/50 transition-all duration-500 ease-out flex flex-col z-40 shadow-xl rounded-2xl ${isExpanded ? "w-64" : "w-16"
                }`}
        >
            {/* User Profile Card - Expanded View */}
            <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="p-3">
                    <div className="relative">
                        {/* Banner Background */}
                        <div className="h-24 rounded-xl bg-gradient-to-br from-sky-200 via-sky-100 to-blue-100 dark:from-sky-900/40 dark:via-blue-900/30 dark:to-indigo-900/40 overflow-hidden">
                            {/* Cloud-like decorations */}
                            <div className="absolute top-4 right-8 w-16 h-8 bg-white/60 dark:bg-white/20 rounded-full blur-sm"></div>
                            <div className="absolute top-6 right-4 w-12 h-6 bg-white/50 dark:bg-white/15 rounded-full blur-sm"></div>
                            <div className="absolute top-8 left-6 w-10 h-5 bg-white/40 dark:bg-white/10 rounded-full blur-sm"></div>

                            {/* Minimize Button */}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-white/20 backdrop-blur-sm rounded-full text-gray-700 dark:text-white hover:bg-white dark:hover:bg-white/30 transition-all duration-300 shadow-sm hover:scale-110"
                            >
                                {/* <ChevronFirst size={16} /> */}
                                <ArrowBigLeft size={16} />
                            </button>
                        </div>

                        {/* Avatar - Overlapping Banner */}
                        <div className="absolute -bottom-6 left-3">
                            {userAvatar ? (
                                <img
                                    src={userAvatar}
                                    alt={username}
                                    className="w-18 h-18 rounded-full object-cover shadow-lg ring-3 ring-white dark:ring-gray-800 transition-transform duration-300 hover:scale-110"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-3 ring-white dark:ring-gray-800 transition-transform duration-300 hover:scale-110">
                                    {userInitial}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="mt-8 px-1">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white">
                            {'@' + username}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-10">
                            Product Designer who focuses on simplicity & usability.
                        </p>
                    </div>
                </div>
            </div>

            {/* Collapsed Avatar Only */}
            <div className={`overflow-hidden transition-all duration-500 ease-out ${!isExpanded ? "max-h-20 opacity-100 p-3" : "max-h-0 opacity-0 p-0"}`}>
                <div className="flex justify-center">
                    {userAvatar ? (
                        <img
                            src={userAvatar}
                            alt={username}
                            className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-white/20 transition-transform duration-300 hover:scale-110"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20 transition-transform duration-300 hover:scale-110">
                            {userInitial}
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button - Only visible when collapsed */}
            {!isExpanded && (
                <div className="flex items-center justify-center transition-all duration-300">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:scale-110"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            )}

            {/* Navigation Links */}
            <nav className={`mb-5 flex flex-col gap-1 transition-all duration-300 ${isExpanded ? "px-3" : "px-2"}`}>
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            style={{ transitionDelay: `${index * 30}ms` }}
                            className={`flex items-center rounded-xl transition-all duration-300 ease-out group relative
                                ${isExpanded ? "gap-3 px-3 py-3" : "justify-center p-3"}
                                ${isActive
                                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white hover:translate-x-1'
                                }
                            `}
                        >
                            <Icon
                                size={22}
                                className={`shrink-0 transition-transform duration-300 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:scale-110'
                                    }`}
                            />

                            <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 absolute"}`}>
                                {item.name}
                            </span>

                            {/* Hover Tooltip for collapsed state */}
                            {!isExpanded && (
                                <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900/95 backdrop-blur text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 whitespace-nowrap pointer-events-none shadow-xl translate-x-2 group-hover:translate-x-0">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;


