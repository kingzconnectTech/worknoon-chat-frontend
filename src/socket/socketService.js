import { io } from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    const token = useAuthStore.getState().token;
    
    if (!token) return;

    this.socket = io(SOCKET_URL, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server:', this.socket.id);
    });

    this.socket.on('online_users', (users) => {
      useChatStore.getState().setOnlineUsers(users);
    });

    this.socket.on('receive_message', (message) => {
      // Only add message to state if we are currently looking at the conversation,
      // or we handle notification toast here.
      const state = useChatStore.getState();
      
      // We'll update the store (add message, update last message in conversation list)
      state.addMessage(message);
    });

    this.socket.on('user_typing', ({ conversationId, userId }) => {
      useChatStore.getState().setTypingStatus(conversationId, userId, true);
    });

    this.socket.on('user_stop_typing', ({ conversationId, userId }) => {
      useChatStore.getState().setTypingStatus(conversationId, userId, false);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  joinConversation(conversationId) {
    if (this.socket) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }

  emitTyping(conversationId) {
    if (this.socket) {
      this.socket.emit('typing', { conversationId });
    }
  }

  emitStopTyping(conversationId) {
    if (this.socket) {
      this.socket.emit('stop_typing', { conversationId });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
export default socketService;
