const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Message = require('./models/Message');

const COMMUNITY_ROOM = 'community';
const MESSAGE_HISTORY_LIMIT = 20;

/**
 * Attach Socket.IO event handlers.
 * @param {import('socket.io').Server} io
 */
function setupSocket(io) {
  // ── Auth middleware — verify JWT on every connection ──
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('username avatar name');
      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach user data to the socket for later use
      socket.user = {
        _id: user._id.toString(),
        username: user.username,
        avatar: user.avatar || '',
        name: user.name,
      };

      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  // ── Connection handler ──
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.user.username} (${socket.id})`);

    // ── Join the community room ──
    socket.on('joinCommunity', async () => {
      socket.join(COMMUNITY_ROOM);

      // Send recent message history
      try {
        const messages = await Message.find({ room: COMMUNITY_ROOM })
          .sort({ createdAt: -1 })
          .limit(MESSAGE_HISTORY_LIMIT)
          .lean();

        // Send oldest-first so the client can render in order
        socket.emit('chatHistory', messages.reverse());
      } catch (err) {
        console.error('Error fetching chat history:', err);
        socket.emit('chatHistory', []);
      }

      // Notify room about the new user
      socket.to(COMMUNITY_ROOM).emit('userJoined', {
        username: socket.user.username,
        avatar: socket.user.avatar,
      });

      // Send current online count
      const onlineCount = io.sockets.adapter.rooms.get(COMMUNITY_ROOM)?.size || 0;
      io.to(COMMUNITY_ROOM).emit('onlineCount', onlineCount);
    });

    // ── Fetch more messages (pagination) ──
    socket.on('fetchMoreMessages', async (data) => {
      try {
        const { cursor } = data || {};
        const query = { room: COMMUNITY_ROOM };
        
        if (cursor) {
          query.createdAt = { $lt: new Date(cursor) };
        }
        
        const messages = await Message.find(query)
          .sort({ createdAt: -1 })
          .limit(MESSAGE_HISTORY_LIMIT)
          .lean();
        
        // Send oldest-first so the client can prepend them in order
        socket.emit('moreMessages', messages.reverse());
      } catch (err) {
        console.error('Error fetching more messages:', err);
      }
    });

    // ── Send a message ──
    socket.on('sendMessage', async (data) => {
      const content = (data?.content || '').trim();

      if (!content || content.length > 500) {
        return socket.emit('messageError', 'Message must be 1-500 characters.');
      }

      try {
        const message = await Message.create({
          sender: socket.user._id,
          username: socket.user.username,
          avatar: socket.user.avatar,
          content,
          room: COMMUNITY_ROOM,
        });

        const messageData = {
          _id: message._id,
          sender: message.sender,
          username: message.username,
          avatar: message.avatar,
          content: message.content,
          room: message.room,
          createdAt: message.createdAt,
        };

        // Broadcast to everyone in the room (including sender)
        io.to(COMMUNITY_ROOM).emit('newMessage', messageData);
      } catch (err) {
        console.error('Error saving message:', err);
        socket.emit('messageError', 'Failed to send message. Try again.');
      }
    });

    // ── Typing indicator ──
    socket.on('typing', () => {
      socket.to(COMMUNITY_ROOM).emit('userTyping', {
        username: socket.user.username,
      });
    });

    socket.on('stopTyping', () => {
      socket.to(COMMUNITY_ROOM).emit('userStopTyping', {
        username: socket.user.username,
      });
    });

    // ── Disconnect ──
    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.user.username} (${socket.id})`);

      // Update online count for the room
      const onlineCount = io.sockets.adapter.rooms.get(COMMUNITY_ROOM)?.size || 0;
      io.to(COMMUNITY_ROOM).emit('onlineCount', onlineCount);

      socket.to(COMMUNITY_ROOM).emit('userLeft', {
        username: socket.user.username,
      });
    });
  });
}

module.exports = { setupSocket };
