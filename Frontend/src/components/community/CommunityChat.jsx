import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { resolveAvatar } from '@/utils/avatarHelper';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  ArrowDown,
  Users,
  MessageSquare,
  Wifi,
  WifiOff,
  Loader2,
} from 'lucide-react';

/* ─── helpers ─── */
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateDivider = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const shouldShowDateDivider = (messages, index) => {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].createdAt).toDateString();
  const curr = new Date(messages[index].createdAt).toDateString();
  return prev !== curr;
};

const MAX_CHARS = 500;

/* ─── Typing Indicator Dots ─── */
const TypingDots = () => (
  <div className="flex items-center gap-1 px-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

/* ─── Message Skeleton ─── */
const MessageSkeleton = () => (
  <div className="flex gap-3 px-4 py-3 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700" />
    <div className="flex-1 space-y-2">
      <div className="flex gap-2">
        <div className="h-3 w-20 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3 w-10 rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
    </div>
  </div>
);

/* ─── Empty State ─── */
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 select-none">
    <div className="w-20 h-20 rounded-2xl bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center mb-5 border border-zinc-950 dark:border-zinc-100">
      <MessageSquare size={30} className="text-white dark:text-zinc-900" />
    </div>
    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 tracking-tight">
      No messages yet
    </h3>
    <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-[240px] leading-relaxed">
      Be the first to say hello and start the conversation!
    </p>
  </div>
);

/* ═══════════════════════════════════════════
   COMMUNITY CHAT — Main Component
   ═══════════════════════════════════════════ */
const CommunityChat = () => {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const previousScrollHeightRef = useRef(0);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const currentUserId = user?._id || user?.id;
  const currentUsername = user?.username;

  /* ── Scroll helpers ── */
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBtn(distanceFromBottom > 150);

    if (
      container.scrollTop < 150 &&
      !loading &&
      !fetchingMore &&
      hasMore &&
      messages.length > 0
    ) {
      setFetchingMore(true);
      previousScrollHeightRef.current = container.scrollHeight - container.scrollTop;
      socket.emit('fetchMoreMessages', { cursor: messages[0].createdAt });
    }
  }, [loading, fetchingMore, hasMore, messages, socket]);

  /* ── Socket events ── */
  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('joinCommunity');

    const handleHistory = (history) => {
      setMessages(history);
      setHasMore(history.length === 20);
      setLoading(false);
      setTimeout(() => scrollToBottom('instant'), 100);
    };

    const handleMoreMessages = (olderMessages) => {
      if (olderMessages.length < 20) {
        setHasMore(false);
      }
      setMessages((prev) => [...olderMessages, ...prev]);
      setFetchingMore(false);

      setTimeout(() => {
        const container = chatContainerRef.current;
        if (container && previousScrollHeightRef.current) {
          container.scrollTop = container.scrollHeight - previousScrollHeightRef.current;
        }
      }, 0);
    };

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      const container = chatContainerRef.current;
      if (container) {
        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;
        if (distanceFromBottom < 200) {
          setTimeout(() => scrollToBottom(), 50);
        }
      }
    };

    const handleOnlineCount = (count) => setOnlineCount(count);

    const handleUserTyping = ({ username }) => {
      if (username === currentUsername) return;
      setTypingUsers((prev) =>
        prev.includes(username) ? prev : [...prev, username],
      );
    };

    const handleUserStopTyping = ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    const handleUserLeft = ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    const handleError = (errMsg) => {
      console.error('Message error:', errMsg);
      setSending(false);
    };

    socket.on('chatHistory', handleHistory);
    socket.on('moreMessages', handleMoreMessages);
    socket.on('newMessage', handleNewMessage);
    socket.on('onlineCount', handleOnlineCount);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStopTyping', handleUserStopTyping);
    socket.on('userLeft', handleUserLeft);
    socket.on('messageError', handleError);

    return () => {
      socket.off('chatHistory', handleHistory);
      socket.off('moreMessages', handleMoreMessages);
      socket.off('newMessage', handleNewMessage);
      socket.off('onlineCount', handleOnlineCount);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStopTyping', handleUserStopTyping);
      socket.off('userLeft', handleUserLeft);
      socket.off('messageError', handleError);
    };
  }, [socket, isConnected, currentUsername, scrollToBottom]);

  /* ── Typing indicator logic ── */
  const handleTyping = useCallback(() => {
    if (!socket || !isConnected) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing');
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit('stopTyping');
    }, 1500);
  }, [socket, isConnected]);

  /* ── Send message ── */
  const handleSend = useCallback(() => {
    const content = input.trim();
    if (!content || !socket || !isConnected || sending) return;

    setSending(true);
    socket.emit('sendMessage', { content });
    setInput('');
    setSending(false);

    clearTimeout(typingTimeoutRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('stopTyping');
    }
  }, [input, socket, isConnected, sending]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Disconnected fallback ── */
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center select-none">
        <div className="w-16 h-16 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
          <WifiOff size={26} className="text-zinc-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1 tracking-tight">
            Connection Lost
          </h3>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Reconnecting to the community chat…
          </p>
        </div>
        <Loader2 size={18} className="animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden
                  bg-white dark:bg-zinc-950
                  border border-zinc-200 dark:border-zinc-800"
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5
                    border-b border-zinc-200 dark:border-zinc-800
                    bg-white dark:bg-zinc-950"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center border border-zinc-950 dark:border-zinc-100">
              <MessageSquare size={18} className="text-white dark:text-zinc-900" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-zinc-950" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
              Community Chat
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Wifi size={10} className="text-emerald-500" />
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium">
                {onlineCount} online
              </span>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full
                      border border-zinc-200 dark:border-zinc-700
                      bg-zinc-50 dark:bg-zinc-900"
        >
          <Users size={13} className="text-zinc-500 dark:text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {onlineCount}
          </span>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain scroll-smooth
                   bg-zinc-50 dark:bg-zinc-950
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {loading ? (
          <div className="py-4">
            {[...Array(6)].map((_, i) => (
              <MessageSkeleton key={i} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="px-2 sm:px-4 py-4">
            {fetchingMore && (
              <div className="py-1 opacity-70 transition-opacity">
                <MessageSkeleton />
                <MessageSkeleton />
              </div>
            )}
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isOwn =
                  msg.sender === currentUserId || msg.username === currentUsername;
                const showDivider = shouldShowDateDivider(messages, idx);
                const showAvatar =
                  idx === 0 ||
                  messages[idx - 1].username !== msg.username ||
                  shouldShowDateDivider(messages, idx);

                return (
                  <React.Fragment key={msg._id || idx}>
                    {/* Date divider */}
                    {showDivider && (
                      <div className="flex items-center gap-3 my-5 px-2">
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                        <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-600 px-2 shrink-0 tracking-wide uppercase">
                          {formatDateDivider(msg.createdAt)}
                        </span>
                        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                      </div>
                    )}

                    {/* Message bubble */}
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${showAvatar ? 'mt-4' : 'mt-0.5'}`}
                    >
                      {/* Avatar */}
                      <div className="w-8 shrink-0">
                        {showAvatar && (
                          <img
                            src={
                              resolveAvatar(msg.avatar) ||
                              `https://ui-avatars.com/api/?name=${msg.username}&background=18181b&color=fff&size=64`
                            }
                            alt={msg.username}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`max-w-[75%] min-w-0 flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
                      >
                        {showAvatar && (
                          <div
                            className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}
                          >
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 tracking-tight">
                              {isOwn ? 'You' : msg.username}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>
                        )}

                        <div
                          className={`inline-block px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap border
                            ${isOwn
                              ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-950 dark:border-zinc-100 rounded-2xl rounded-br-sm'
                              : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-sm'
                            }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="flex items-center gap-2 px-4 py-2 mt-3"
                >
                  <div
                    className="px-3 py-2 rounded-2xl rounded-bl-sm
                                bg-white dark:bg-zinc-900
                                border border-zinc-200 dark:border-zinc-700
                                flex items-center gap-2"
                  >
                    <TypingDots />
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                      {typingUsers.length === 1
                        ? `${typingUsers[0]} is typing`
                        : `${typingUsers.length} people are typing`}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Scroll-to-bottom FAB ── */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-24 right-4 w-8 h-8 rounded-full
                       bg-white dark:bg-zinc-900
                       border border-zinc-200 dark:border-zinc-700
                       flex items-center justify-center
                       hover:bg-zinc-50 dark:hover:bg-zinc-800
                       transition-colors z-10 shadow-sm"
          >
            <ArrowDown size={14} className="text-zinc-500 dark:text-zinc-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Input Bar ── */}
      <div
        className="border-t border-zinc-200 dark:border-zinc-800
                    bg-white dark:bg-zinc-950
                    px-3 sm:px-4 py-3"
      >
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              id="chat-input"
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInput(e.target.value);
                  handleTyping();
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="w-full resize-none rounded-xl px-4 py-2.5
                         bg-zinc-50 dark:bg-zinc-900
                         text-sm text-zinc-900 dark:text-zinc-100
                         placeholder-zinc-400 dark:placeholder-zinc-600
                         border border-zinc-200 dark:border-zinc-700
                         focus:border-zinc-950 dark:focus:border-zinc-300
                         focus:outline-none transition-colors duration-150
                         max-h-28 scrollbar-thin"
              style={{
                minHeight: '42px',
                height: 'auto',
                overflow: input.split('\n').length > 3 ? 'auto' : 'hidden',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px';
              }}
            />
            {/* Character count */}
            {input.length > 400 && (
              <span
                className={`absolute bottom-2 right-3 text-[10px] font-medium
                  ${input.length >= MAX_CHARS
                    ? 'text-red-500'
                    : 'text-zinc-400 dark:text-zinc-500'
                  }`}
              >
                {input.length}/{MAX_CHARS}
              </span>
            )}
          </div>

          <button
            id="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                       bg-zinc-950 dark:bg-zinc-100
                       text-white dark:text-zinc-900
                       border border-zinc-950 dark:border-zinc-100
                       hover:bg-zinc-800 dark:hover:bg-zinc-200
                       disabled:opacity-30 disabled:cursor-not-allowed
                       active:scale-95 transition-all duration-150"
          >
            {sending ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;